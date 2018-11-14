/*
 * Created by: Pavel Borisov (pborisov@naumen.ru>) on 13.11.2018
 * -----
 * Last Modified: 14.11.2018 16:17:55
 * Modified By: Pavel Borisov (pborisov@naumen.ru>)
 */

import * as Konva from 'konva';
import * as React from 'react';
import {Layer, Rect, Stage, Text, Circle, Line} from 'react-konva';
import { Game } from './Game';
// import { Game } from './Game';

interface IProps {
    h: number;
    w: number;
}
  
interface IVector {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
// interface IState {}

interface IFigure {
    render(): JSX.Element;
    normals(target: IVector): IVector[];
}

interface IRect extends IFigure {
    x: number;
    y: number;
    w: number;
    h: number;
}

class RectDrawer implements IRect {    
    public x: number;
    public y: number;
    public w: number;
    public h: number;

    constructor(rect: IRect) {
        Object.assign( this, rect );
    }

    public render(): JSX.Element {
        const {x,y,w,h} = this;

        return (
            <Rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={'red'}
                shadowBlur={5}
            />
        );
    }

    public normals(target: IVector): IVector[] {
        return [];
    }
}

interface ICircle extends IFigure {
    x: number;
    y: number;
    r: number;
}

class CircleDrawer implements ICircle {    
    public x: number;
    public y: number;
    public r: number;

    constructor(circle: ICircle) {
        Object.assign( this, circle );
    }

    public render(): JSX.Element {
        const {x,y,r} = this;

        return (
            <Circle
                x={x}
                y={y}
                radius={r}
                fill={'red'}
                shadowBlur={5}
            />
        );
    }

    public normals(target: IVector): IVector[] {
        const {x,y,r} = this;
        const dist = Math.sqrt(
            (target.x2 - target.x1)  * (target.x2 - target.x1) +
            (target.y2 - target.y1) * (target.y2 - target.y1)
        );
        
        return [ {
            x1: x + (r / dist * (target.x2 - target.x1)), y1: y + (r / dist * (target.y2 - target.y1)), 
            x2: x + ((r + 1) / dist * (target.x2 - target.x1)), y2: y + ((r + 1) / dist * (target.y2 - target.y1)) 
        } ];
    }
}

interface IPoint extends IFigure {
    x: number;
    y: number;
}

class HeroDrawer implements IPoint {
    public x: number;
    public y: number;    

    constructor(point: IPoint) {
        Object.assign( this, point );
    }

    public render(): JSX.Element {
        const {x,y} = this;

        return (            
            <Circle
                x={x}
                y={y}
                radius={11}
                fill={'blue'}
                shadowBlur={5}
            />
        );
    }

    public normals(target: IVector): IVector[] {
        return [];
    }
}

class Field extends React.Component<IProps, {board: number[][], field: IFigure[], hero: IFigure, potential: IFigure[]}> {    
    public state = {
        board: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],

        field: [
            new RectDrawer({ x: 210, y: 240, w: 10, h: 10 } as IRect),
            new RectDrawer({ x: 20, y: 10, w: 20, h: 30 } as IRect),
            new RectDrawer({ x: 80, y: 10, w: 70, h: 36 } as IRect),
            new RectDrawer({ x: 20, y: 150, w: 70, h: 30 } as IRect),
            new RectDrawer({ x: 150, y: 160, w: 70, h: 30 } as IRect),
            new RectDrawer({ x: 50, y: 80, w: 20, h: 30 } as IRect),
            new CircleDrawer({ x: 110, y: 120, r: 25 } as ICircle),
            new CircleDrawer({ x: 210, y: 50, r: 45 } as ICircle),
            new CircleDrawer({ x: 120, y: 300, r: 76 } as ICircle),

            new RectDrawer({ x: 410, y: 180, w: 10, h: 50 } as IRect),
            new RectDrawer({ x: 270, y: 10, w: 50, h: 30 } as IRect),
            new RectDrawer({ x: 380, y: 10, w: 40, h: 36 } as IRect),
            new RectDrawer({ x: 240, y: 160, w: 30, h: 70 } as IRect),
            new RectDrawer({ x: 450, y: 190, w: 30, h: 70 } as IRect),
            new RectDrawer({ x: 320, y: 80, w: 70, h: 70 } as IRect),
            new CircleDrawer({ x: 470, y: 120, r: 45 } as ICircle),
            new CircleDrawer({ x: 510, y: 50, r: 25 } as ICircle),
            new CircleDrawer({ x: 360, y: 300, r: 56 } as ICircle)
        ],

        hero: new HeroDrawer({x:150, y: 120} as IPoint),

        potential: []
    }

    private timerId?:number = undefined;

    constructor(props: IProps) {
        super(props);

        this.onTick = this.onTick.bind(this);
        this.calculatePotential = this.calculatePotential.bind(this);
    }

    public componentDidMount() {
        this.onTick();
    }

    public componentWillUnmount() {
        window.clearTimeout(this.timerId);
    }

    public render() {
        const {w,h} = this.props;
        const field = this.renderField(w,h);

        const grid = [];
        const gridStepX = Game.field.displayWidth;
        for(let i = 0; i < Game.field.width; i++) {
            grid.push(<Line key={i + "x"} points={[i * gridStepX,0, i * gridStepX, Game.field.height * Game.field.displayHeight]} stroke={'gray'} strokeWidth={1}/>)
        }

        const gridStepY = Game.field.displayHeight;
        for(let i = 0; i < Game.field.height; i++) {
            grid.push(<Line key={i + "y"} points={[0, i * gridStepY, Game.field.width * Game.field.displayWidth, i * gridStepY]} stroke={'gray'} strokeWidth={1}/>)
        }                        
        
        return (
        <div className="App">
            <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Text x={35} y={25} text="Try" fill={Konva.Util.getRandomColor()}/>
                <Text x={5} y={335} text="Try" fill={Konva.Util.getRandomColor()} />
                <Text x={135} y={25} text="Try" fill={Konva.Util.getRandomColor()} />
                <Text text="Try click on rect" />
                { grid }
                { this.state.hero.render() }
                { field }                
            </Layer>
            </Stage>
        </div>    
        );
    }
    
    public onTick() {
        // const {w,h} = this.props;
        // const gameField: IFigure[] = this.state.field;

        // gameField.map( item => {
        //     if( item instanceof IRect)
        //         return new RectDrawer(item as IRect).render();
        // })
        // const x = Math.floor( Math.random() * w );
        // const y = Math.floor( Math.random() * h );
        // if(!gameField[x]) {
        //     gameField[x] = [];
        // }

        // gameField[x][y] = !gameField[x][y] ? 1 : 0;

        // // update state
        // this.setState({board: gameField});
        
        const { hero } = this.state;
        const gameField: IFigure[] = this.state.field;

        const x = hero.x + Math.random() * 10 - 5;
        const y = hero.y + Math.random() * 10 - 5;
        const r = 11;

        if( !gameField.find( figure => {
            if(figure instanceof RectDrawer ) {
                return figure.x < x + r && figure.y < y + r && 
                    figure.x + figure.w > x - r && figure.y + figure.h > y - r;
            }

            if(figure instanceof CircleDrawer ) {
                return (x - figure.x) * (x - figure.x) + (y - figure.y) * (y - figure.y) < (figure.r + r) * (figure.r + r);
            }

            return false;
        }) ) {
            // update hero
            hero.x = x;
            hero.y = y;

            this.setState({hero});
        }

        this.timerId = window.setTimeout(this.onTick.bind(this), 100);
    }

    public onTick2() {
        const {w,h} = this.props;
        const gameField: number[][] = this.state.board;

        const x = Math.floor( Math.random() * w );
        const y = Math.floor( Math.random() * h );
        if(!gameField[x]) {
            gameField[x] = [];
        }

        gameField[x][y] = !gameField[x][y] ? 1 : 0;

        // update state
        this.setState({board: gameField});

        this.timerId = window.setTimeout(this.onTick.bind(this), 0);
    }

    private renderField(w: number, h: number): JSX.Element[] {
        const gameField: IFigure[] = this.state.field;

        return gameField.map( item => item.render() );
    }

    private calculatePotential() {
        // const gameField: IFigure[] = this.state.field;
        
        // for( let x = 0; x < Game.field.width * Game.field.displayWidth; x += Game.field.displayWidth) {
        //     for( let y = 0; y < Game.field.height * Game.field.displayHeight; y += Game.field.displayHeight) {
        //         gameField
        //     }
        // }
    }

    // private renderField(w: number, h: number): JSX.Element[] {

    //     const gameField: number[][] = this.state.board;
    //     const field = [];

    //     for( let x = 0; x < w; x++ ) {
    //     for( let y = 0; y < h; y++ ) {            
    //         const color: string = (!!gameField[x] && !!gameField[x][y]) ? 'red' :  '#fff';
    //         field.push(
    //             <Rect
    //                 key={x * y}
    //                 x={x * Game.field.displayWidth}
    //                 y={y * Game.field.displayHeight}
    //                 width={Game.field.displayWidth}
    //                 height={Game.field.displayHeight}
    //                 fill={color}
    //                 shadowBlur={5}
    //             />
    //         );
    //     }
    //     }

    //     return field;
    // }
}

export default Field;
