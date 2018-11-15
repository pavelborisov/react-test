/*
 * Created by: Pavel Borisov (pborisov@naumen.ru>) on 13.11.2018
 * -----
 * Last Modified: 15.11.2018 18:13:21
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
        width: 90,
        height: 45,

        displayWidth: 10,
        displayHeight: 10
    }
}