package entity

import (
	"math/rand"
)

type Monster struct {
	X, Y      int
	HP        int
	MaxHP     int
	Attack    int
	Defense   int
	XPValue   int
	CoinValue int
	Name      string
}

// NewRandomMonster 根据楼层生成随机怪物
func NewRandomMonster(level int, x, y int, r *rand.Rand) *Monster {
	baseHP := 5 + level*3
	baseAttack := 3 + level*2
	baseDefense := 1 + level
	variation := r.Intn(level + 1)
	m := &Monster{
		X: x,
		Y: y,
		HP: baseHP + variation,
		MaxHP: baseHP + variation,
		Attack: baseAttack + variation/2,
		Defense: baseDefense + variation/3,
		XPValue: (level * 5) + variation*2,
		CoinValue: (level * 2) + variation,
	}
	// 根据楼层选不同名字
	names := []string{"哥布林", "兽人", "骷髅兵", "阴暗法师", "恶魔守卫"}
	if level-1 < len(names) {
		m.Name = names[level-1]
	} else {
		m.Name = names[len(names)-1]
	}
	return m
}
