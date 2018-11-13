/*
 * Created by: Pavel Borisov (pborisov@naumen.ru>) on 13.11.2018
 * -----
 * Last Modified: 13.11.2018 19:07:36
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

        displayWidth: 20,
        displayHeight: 20
    }
}