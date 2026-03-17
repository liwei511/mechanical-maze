package main

import (
	"image/color"
	"log"

	"github.com/goblimey/gobot"
	"gobot-roguelike/internal/game"
	"gobot-roguelike/internal/mapgen"
)

func main() {
	// 初始化游戏
	g := game.NewGame()
	g.GenerateLevel(1)

	// 配置gobot
	config := gobot.DefaultConfig()
	config.Title = "Gobot Roguelike"
	config.Width = 800
	config.Height = 600
	config.PixelWidth = 8
	config.PixelHeight = 8

	// 定义颜色
	colors := []color.Color{
		color.Black,         // 0 黑色背景
		color.RGBA{82, 64, 90, 255},   // 1 墙
		color.RGBA{160, 160, 160, 255}, // 2 地板
		color.RGBA{0, 255, 0, 255},    // 3 玩家
		color.RGBA{255, 0, 0, 255},    // 4 怪物
		color.RGBA{255, 255, 0, 255},  // 5 宝箱
		color.RGBA{0, 0, 255, 255},    // 6 楼梯
		color.RGBA{255, 160, 0, 255},  // 7 商店
	}

	// 启动游戏
	gb := gobot.New(config, colors)
	gb.SetUpdateCallback(g.Update)
	gb.SetRenderCallback(g.Render)

	log.Println("Gobot Roguelike 启动了")
	if err := gb.Run(); err != nil {
		log.Fatal(err)
	}
}
