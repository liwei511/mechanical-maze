package items

import (
	"math/rand"
)

// Item 物品接口
type Item interface {
	GetName() string
}

// Weapon 武器
type Weapon struct {
	Name        string
	AttackBonus int
}

func (w *Weapon) GetName() string {
	return w.Name
}

// Armor 护甲
type Armor struct {
	Name         string
	DefenseBonus int
}

func (a *Armor) GetName() string {
	return a.Name
}

// Potion 血瓶
type Potion struct {
	HealAmount int
}

func (p *Potion) GetName() string {
	return "血瓶"
}

// RandomItem 根据楼层随机生成物品
func RandomItem(level int, r *rand.Rand) Item {
	roll := r.Intn(100)
	if roll < 40 {
		// 武器
		base := 2 + level
		bonus := r.Intn(level)
		w := &Weapon{
			AttackBonus: base + bonus,
		}
		// 按等级取名字
		names := []string{"匕首", "短剑", "铁剑", "钢剑", "战斧", "圣剑"}
		if level-1 < len(names) {
			w.Name = names[level-1]
		} else {
			w.Name = names[len(names)-1]
		}
		return w
	} else if roll < 80 {
		// 护甲
		base := 1 + level/2
		bonus := r.Intn(level/2 + 1)
		a := &Armor{
			DefenseBonus: base + bonus,
		}
		names := []string{"布衣", "皮甲", "锁子甲", "板甲", "魔法甲", "圣甲"}
		if level-1 < len(names) {
			a.Name = names[level-1]
		} else {
			a.Name = names[len(names)-1]
		}
		return a
	} else {
		// 血瓶
		return &Potion{
			HealAmount: 10 + level*2,
		}
	}
}
