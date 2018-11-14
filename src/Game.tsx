/*
 * Created by: Pavel Borisov (pborisov@naumen.ru>) on 13.11.2018
 * -----
 * Last Modified: 14.11.2018 10:36:58
 * Modified By: Pavel Borisov (pborisov@naumen.ru>)
 */

export namespace Game {
    interface IFieldConst {
        width: number,
        height: number,

        displayWidth: number,
        displayHeight: number
    }

    export const field: IFieldConst = {
        width: 40,// 90,
        height: 20,// 45,

        displayWidth: 20,
        displayHeight: 20
    }
}