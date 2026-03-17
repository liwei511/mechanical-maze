package entity

import (
	"gobot-roguelike/internal/items"
)

type Player struct {
	X, Y         int
	HP           int
	MaxHP        int
	Attack       int
	Defense      int
	XP           int
	NextLevelXP  int
	Level        int
	Coins        int
	Inventory    []items.Item
	CurrentWeapon *items.Weapon
	CurrentArmor  *items.Armor
}

func NewPlayer() *Player {
	return &Player{
		X: 0,
		Y: 0,
		HP: 20,
		MaxHP: 20,
		Attack: 5,
		Defense: 2,
		XP: 0,
		NextLevelXP: 10,
		Level: 1,
		Coins: 0,
		Inventory: make([]items.Item, 0),
	}
}

// Attack 攻击怪物
func (p *Player) Attack(m *Monster) {
	totalAttack := p.Attack
	if p.CurrentWeapon != nil {
		totalAttack += p.CurrentWeapon.AttackBonus
	}
	damage := totalAttack - m.Defense
	if damage < 1 {
		damage = 1
	}
	m.HP -= damage
	// 怪物反击
	if m.HP > 0 {
		mDamage := m.Attack - p.Defense
		if p.CurrentArmor != nil {
			mDamage -= p.CurrentArmor.DefenseBonus
		}
		if mDamage < 1 {
			mDamage = 1
		}
		p.HP -= mDamage
	}
}

// GainXP 获得经验，升级
func (p *Player) GainXP(xp int) {
	p.XP += xp
	for p.XP >= p.NextLevelXP {
		p.XP -= p.NextLevelXP
		p.LevelUp()
	}
}

// LevelUp 升级，增加属性
func (p *Player) LevelUp() {
	p.Level++
	p.NextLevelXP = p.Level * 10
	// 全属性提升
	p.MaxHP += 5
	p.HP = p.MaxHP // 升级回满
	p.Attack += 2
	p.Defense += 1
}

// Visible 检查格子是否在玩家可视范围内（迷雾）
func (p *Player) Visible(x, y int) bool {
	dx := x - p.X
	dy := y - p.Y
	// 曼哈顿距离不超过5就是可见
	return abs(dx) + abs(dy) <= 5
}

func abs(a int) int {
	if a < 0 {
		return -a
	}
	return a
}

// EquipWeapon 装备武器
func (p *Player) EquipWeapon(w *items.Weapon) {
	p.CurrentWeapon = w
}

// EquipArmor 装备护甲
func (p *Player) EquipArmor(a *items.Armor) {
	p.CurrentArmor = a
}
