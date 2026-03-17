package game

import (
	"image/color"
	"math/rand"
	"time"

	"gobot-roguelike/internal/entity"
	"gobot-roguelike/internal/mapgen"
	"gobot-roguelike/internal/items"

	"github.com/goblimey/gobot"
)

type GameState int

const (
	StatePlaying GameState = iota
	StateMenu
	StateGameOver
	StateWin
)

type Game struct {
	State     GameState
	Level     int
	Player    *entity.Player
	CurrentMap *mapgen.LevelMap
	Random    *rand.Rand
}

func NewGame() *Game {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	p := entity.NewPlayer()
	return &Game{
		State: StatePlaying,
		Level: 1,
		Player: p,
		Random: r,
	}
}

// GenerateLevel 生成新楼层
func (g *Game) GenerateLevel(level int) {
	g.Level = level
	g.CurrentMap = mapgen.GenerateLevel(20, 20, level, g.Random)
	// 玩家出生在楼梯口
	g.Player.X = g.CurrentMap.StartX
	g.Player.Y = g.CurrentMap.StartY
}

// NextLevel 下一层
func (g *Game) NextLevel() {
	g.Level++
	if g.Level > 10 {
		g.State = StateWin
		return
	}
	g.GenerateLevel(g.Level)
}

// Update 每一帧更新
func (g *Game) Update(gb *gobot.GameBoy) {
	if g.State != StatePlaying {
		return
	}

	// 处理输入
	moved := false
	newX, newY := g.Player.X, g.Player.Y

	if gb.KeyPressed(gobot.KeyUp) {
		newY--
		moved = true
	} else if gb.KeyPressed(gobot.KeyDown) {
		newY++
		moved = true
	} else if gb.KeyPressed(gobot.KeyLeft) {
		newX--
		moved = true
	} else if gb.KeyPressed(gobot.KeyRight) {
		newX++
		moved = true
	}

	// 检查能不能走
	if moved && g.CurrentMap.IsWalkable(newX, newY) {
		// 检查这里有没有怪物
		if monster := g.CurrentMap.GetMonsterAt(newX, newY); monster != nil {
			g.Player.Attack(monster)
			if monster.HP <= 0 {
				// 打死怪物，拿奖励
				g.Player.GainXP(monster.XPValue)
				g.Player.Coins += monster.CoinValue
				// 概率掉装备
				if g.Random.Float64() < 0.2 {
					item := items.RandomItem(g.Level, g.Random)
					g.Player.Inventory = append(g.Player.Inventory, item)
				}
				g.CurrentMap.RemoveMonster(monster)
			}
		} else if g.CurrentMap.IsStairs(newX, newY) && g.Level < 10 {
			// 下一层
			g.NextLevel()
		} else if g.CurrentMap.IsChest(newX, newY) {
			// 开宝箱
			item := items.RandomItem(g.Level, g.Random)
			g.Player.Inventory = append(g.Player.Inventory, item)
			g.CurrentMap.ClearChest(newX, newY)
		} else {
			// 正常移动
			g.Player.X, g.Player.Y = newX, newY
		}
	}

	// 玩家攻击（空格）
	if gb.KeyPressed(gobot.KeySpace) {
		// 检查相邻格子有没有怪物
		for _, dir := range []struct{dx, dy int}{{-1,0}, {1,0}, {0,-1}, {0,1}} {
			mx := g.Player.X + dir.dx
			my := g.Player.Y + dir.dy
			if monster := g.CurrentMap.GetMonsterAt(mx, my); monster != nil {
				g.Player.Attack(monster)
				if monster.HP <= 0 {
					g.Player.GainXP(monster.XPValue)
					g.Player.Coins += monster.CoinValue
					g.CurrentMap.RemoveMonster(monster)
				}
			}
		}
	}

	// 检查玩家死了没
	if g.Player.HP <= 0 {
		g.State = StateGameOver
	}
}

// Render 渲染
func (g *Game) Render(gb *gobot.GameBoy) {
	// 清屏
	gb.Clear(0)

	// 渲染地图
	cellSize := 8
	offsetX := 10
	offsetY := 10

	for y := 0; y < g.CurrentMap.Height; y++ {
		for x := 0; x < g.CurrentMap.Width; x++ {
			// 只有玩家周围一定范围才显示（迷雾）
			if g.Player.Visible(x, y) {
				cell := g.CurrentMap.Cells[y][x]
				var colorIndex int
				switch cell.Type {
				case mapgen.CellWall:
					colorIndex = 1
				case mapgen.CellFloor:
					colorIndex = 2
				case mapgen.CellStairs:
					colorIndex = 6
				case mapgen.CellChest:
					colorIndex = 5
				case mapgen.CellShop:
					colorIndex = 7
				default:
					colorIndex = 2
				}
				gb.SetPixel(offsetX + x*cellSize, offsetY + y*cellSize, colorIndex)
			}
		}
	}

	// 渲染怪物
	for _, m := range g.CurrentMap.Monsters {
		if g.Player.Visible(m.X, m.Y) {
			px := offsetX + m.X*cellSize
			py := offsetY + m.Y*cellSize
			gb.SetPixel(px, py, 4)
		}
	}

	// 渲染玩家
	px := offsetX + g.Player.X*cellSize
	py := offsetY + g.Player.Y*cellSize
	gb.SetPixel(px, py, 3)

	// 右边UI信息
	uiX := offsetX + 20*cellSize + 10
	gb.DrawText(uiX, offsetY+0, 7, "Level: "+itoa(g.Level))
	gb.DrawText(uiX, offsetY+10, 7, "HP: "+itoa(g.Player.HP)+"/"+itoa(g.Player.MaxHP))
	gb.DrawText(uiX, offsetY+20, 7, "ATK: "+itoa(g.Player.Attack))
	gb.DrawText(uiX, offsetY+30, 7, "DEF: "+itoa(g.Player.Defense))
	gb.DrawText(uiX, offsetY+40, 7, "Coins: "+itoa(g.Player.Coins))
	gb.DrawText(uiX, offsetY+50, 7, "XP: "+itoa(g.Player.XP)+"/"+itoa(g.Player.NextLevelXP))

	// 游戏结束/胜利提示
	if g.State == StateGameOver {
		gb.DrawText(200, 200, 4, "GAME OVER")
		gb.DrawText(200, 220, 2, "You reached level " + itoa(g.Level))
	} else if g.State == StateWin {
		gb.DrawText(200, 200, 3, "YOU WIN!")
		gb.DrawText(200, 220, 5, "You cleared all 10 floors!")
	}
}

// itoa 简单整形转字符串
func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	s := ""
	for n > 0 {
		s = string(rune(n%10 + '0')) + s
		n /= 10
	}
	return s
}
