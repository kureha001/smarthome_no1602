function センサーOFF () {
    センサーOFF_要否()
    basic.clearScreen()
}
function センサーOFF_要否 () {
    要否_雨量計測 = 定数_閉じる
    要否_気温観測 = 定数_閉じる
    要否_侵入者検知 = 定数_閉じる
    要否_GAS検知 = 定数_閉じる
}
input.onLogoEvent(TouchButtonEvent.Touched, function () {
    初期化_LCD()
    basic.clearScreen()
    music.playTone(988, music.beat(BeatFraction.Eighth))
})
function 機能_外観_玄関 (数値: number) {
    if (数値 == 定数_開く) {
        pins.digitalWritePin(DigitalPin.P16, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P16, 0)
    }
}
function 機能_電飾_点灯 () {
    if (カラー番号 == 1) {
        RGB配列.showColor(neopixel.colors(NeoPixelColors.Red))
    } else if (カラー番号 == 2) {
        RGB配列.showColor(neopixel.colors(NeoPixelColors.Yellow))
    } else if (カラー番号 == 3) {
        RGB配列.showColor(neopixel.colors(NeoPixelColors.Green))
    } else if (カラー番号 == 4) {
        RGB配列.showColor(neopixel.colors(NeoPixelColors.Blue))
    } else if (カラー番号 == 5) {
        RGB配列.showColor(neopixel.colors(NeoPixelColors.Purple))
    } else if (カラー番号 == 6) {
        RGB配列.showColor(neopixel.colors(NeoPixelColors.White))
    }
}
function 機能_外観_扉 (数値: number) {
    pins.servoWritePin(AnalogPin.P8, 数値)
    if (数値 == 定数_開く) {
        pins.servoWritePin(AnalogPin.P8, 180)
    } else {
        pins.servoWritePin(AnalogPin.P8, 0)
    }
}
function センサー表示 (タイトル: string, センサー値: number) {
    basic.pause(100)
}
function 戸締り_する () {
    basic.clearScreen()
    機能_外観_扉(定数_閉じる)
    機能_外観_窓(定数_閉じる)
    機能_外観_玄関(定数_開く)
}
bluetooth.onBluetoothConnected(function () {
    状態_接続 = 定数_開く
    basic.showLeds(`
        . . # # .
        # . # . #
        . # # # .
        # . # . #
        . . # # .
        `)
    music.playTone(988, music.beat(BeatFraction.Half))
    while (状態_接続 == 定数_開く) {
        受信コマンド = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
        コマンド実行()
    }
})
function 機能_外観 () {
    basic.showIcon(IconNames.House)
    if (受信コマンド == "a") {
        機能_外観_玄関(定数_開く)
    } else if (受信コマンド == "b") {
        機能_外観_玄関(定数_閉じる)
    } else if (受信コマンド == "c") {
        機能_外観_扉(定数_閉じる)
    } else if (受信コマンド == "d") {
        機能_外観_扉(定数_開く)
    } else if (受信コマンド == "e") {
        機能_外観_窓(定数_開く)
    } else if (受信コマンド == "f") {
        機能_外観_窓(定数_閉じる)
    } else if (受信コマンド == "g") {
        機能_外観_扇風機(350, 0)
    } else if (受信コマンド == "h") {
        機能_外観_扇風機(0, 0)
    }
}
bluetooth.onBluetoothDisconnected(function () {
    状態_接続 = 定数_閉じる
    basic.showIcon(IconNames.No)
    music.playTone(131, music.beat(BeatFraction.Half))
})
function 初期化_定数と状態 () {
    定数_閉じる = 0
    定数_開く = 1
    定数_問題なし = 0
    定数_問題あり = 1
    状態_接続 = 定数_閉じる
}
function コマンド実行 () {
    basic.clearScreen()
    if ("a" <= 受信コマンド && 受信コマンド <= "h") {
        センサーOFF()
        機能_外観()
    } else if ("0" <= 受信コマンド && 受信コマンド <= "9") {
        センサーOFF()
        機能_顔の表示()
    } else if ("i" <= 受信コマンド && 受信コマンド <= "k") {
        センサーOFF()
        機能_電飾()
    } else if ("o" <= 受信コマンド && 受信コマンド <= "r") {
        センサーOFF_要否()
        機能_センサー()
    } else if (受信コマンド == "x") {
        センサーOFF()
    }
}
input.onButtonPressed(Button.A, function () {
    戸締り_する()
})
function 機能_外観_窓 (数値: number) {
    if (数値 == 定数_開く) {
        pins.servoWritePin(AnalogPin.P9, 125)
    } else {
        pins.servoWritePin(AnalogPin.P9, 10)
    }
}
function 機能_センサー_ガス () {
    センサー監視("GAS", pins.digitalReadPin(DigitalPin.P1), "=", 0, 定数_開く)
    if (状態_検知 == 定数_問題あり) {
        basic.showIcon(IconNames.Skull)
    }
    basic.pause(1000)
}
function 機能_電飾 () {
    basic.showIcon(IconNames.Butterfly)
    if (受信コマンド == "i") {
        カラー番号 += 1
        if (カラー番号 > 6) {
            カラー番号 = 1
        }
        機能_電飾_点灯()
    } else if (受信コマンド == "j") {
        カラー番号 += -1
        if (カラー番号 < 1) {
            カラー番号 = 6
        }
        機能_電飾_点灯()
    } else if (受信コマンド == "k") {
        カラー番号 = 0
        RGB配列.showColor(neopixel.colors(NeoPixelColors.Black))
    }
}
function 機能_センサー () {
    basic.showIcon(IconNames.Yes)
    if (受信コマンド == "o") {
        要否_気温観測 = 定数_開く
    } else if (受信コマンド == "p") {
        要否_雨量計測 = 定数_開く
    } else if (受信コマンド == "q") {
        要否_GAS検知 = 定数_開く
    } else if (受信コマンド == "r") {
        要否_侵入者検知 = 定数_開く
    }
    basic.pause(100)
}
function 初期化_RGB () {
    RGB配列 = neopixel.create(DigitalPin.P14, 4, NeoPixelMode.RGB)
    RGB配列.clear()
    RGB配列.show()
}
function 初期化_LCD () {
    basic.pause(200)
}
input.onButtonPressed(Button.B, function () {
    戸締り_しない()
})
function 初期化_戸締り () {
    戸締り_する()
    basic.showIcon(IconNames.House)
}
function 機能_顔の表示 () {
    if (受信コマンド == "1") {
        basic.showIcon(IconNames.Happy)
    } else if (受信コマンド == "2") {
        basic.showIcon(IconNames.Sad)
    } else if (受信コマンド == "3") {
        basic.showIcon(IconNames.Asleep)
    } else if (受信コマンド == "4") {
        basic.showIcon(IconNames.Heart)
    } else if (受信コマンド == "5") {
        basic.showIcon(IconNames.Duck)
    } else if (受信コマンド == "6") {
        basic.showIcon(IconNames.House)
    } else if (受信コマンド == "0") {
        basic.clearScreen()
    }
}
function センサー監視 (タイトル: string, センサー値: number, 比較方法: string, 閾値: number, 戸締り要否: number) {
    センサー表示("" + タイトル + ":", センサー値)
    状態_検知 = 定数_問題なし
    if (比較方法 == "=") {
        if (センサー値 == 閾値) {
            状態_検知 = 定数_問題あり
        }
    } else if (比較方法 == ">") {
        if (センサー値 > 閾値) {
            状態_検知 = 定数_問題あり
        }
    }
    if (状態_検知 == 定数_問題あり) {
        センサーOFF()
        music.playTone(988, music.beat(BeatFraction.Whole))
        basic.pause(500)
        if (戸締り要否 == 定数_閉じる) {
            戸締り_する()
        } else {
            戸締り_しない()
        }
    }
}
function 機能_センサー_雨 () {
    センサー監視("Rain", pins.analogReadPin(AnalogPin.P0), ">", 300, 定数_閉じる)
    if (状態_検知 == 定数_問題あり) {
        basic.showIcon(IconNames.Umbrella)
    }
    basic.pause(500)
}
function 機能_センサー_人感 () {
    センサー監視("Shief", pins.digitalReadPin(DigitalPin.P15), "=", 1, 定数_閉じる)
    if (状態_検知 == 定数_問題あり) {
        basic.showIcon(IconNames.StickFigure)
    }
    basic.pause(200)
}
function 戸締り_しない () {
    basic.clearScreen()
    機能_外観_扉(定数_開く)
    機能_外観_窓(定数_開く)
    機能_外観_玄関(定数_閉じる)
}
function 機能_外観_扇風機 (正転: number, 逆転: number) {
    pins.analogWritePin(AnalogPin.P12, 正転)
    pins.analogWritePin(AnalogPin.P13, 逆転)
}
function 機能_センサー_気温 () {
    センサー表示("Temp(C):", input.temperature())
    basic.pause(2000)
}
let 状態_検知 = 0
let 定数_問題あり = 0
let 定数_問題なし = 0
let 受信コマンド = ""
let 状態_接続 = 0
let RGB配列: neopixel.Strip = null
let カラー番号 = 0
let 定数_開く = 0
let 要否_GAS検知 = 0
let 要否_侵入者検知 = 0
let 要否_気温観測 = 0
let 定数_閉じる = 0
let 要否_雨量計測 = 0
初期化_定数と状態()
初期化_RGB()
初期化_戸締り()
初期化_LCD()
basic.forever(function () {
    if (要否_気温観測 == 定数_開く) {
        機能_センサー_気温()
    } else if (要否_雨量計測 == 定数_開く) {
        機能_センサー_雨()
    } else if (要否_GAS検知 == 定数_開く) {
        機能_センサー_ガス()
    } else if (要否_侵入者検知 == 定数_開く) {
        機能_センサー_人感()
    }
})
