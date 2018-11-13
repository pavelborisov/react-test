/*
 * Created by: Pavel Borisov (pborisov@naumen.ru>) on 13.11.2018
 * -----
 * Last Modified: 13.11.2018 19:06:30
 * Modified By: Pavel Borisov (pborisov@naumen.ru>)
 */

import * as Konva from 'konva';
import * as React from 'react';
import {Layer, Rect, Stage, Text} from 'react-konva';
import { Game } from './Game';

interface IProps {
    h: number;
    w: number;
}
  
// interface IState {}

class Field extends React.Component<IProps, {}> {
    public render() {
        const {w,h} = this.props;
        const field = this.renderField(w,h);

        return (
        <div className="App">
            <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Text x={35} y={25} text="Try" fill={Konva.Util.getRandomColor()}/>
                <Text x={5} y={335} text="Try" fill={Konva.Util.getRandomColor()} />
                <Text x={135} y={25} text="Try" fill={Konva.Util.getRandomColor()} />
                <Text text="Try click on rect" />
                { field }
            </Layer>
            </Stage>
        </div>    
        );
    }

    private renderField(w: number, h: number): JSX.Element[] {

        const field = [];

        for( let x = 0; x < w; x++ ) {
        for( let y = 0; y < h; y++ ) {
            field.push(
            <Rect
                key={x * y}
                x={x * Game.field.displayWidth}
                y={y * Game.field.displayHeight}
                width={Game.field.displayWidth}
                height={Game.field.displayHeight}
                fill={Konva.Util.getRandomColor()}
                shadowBlur={5}
            />
            );
        }
        }

        return field;
    }
}

export default Field;
