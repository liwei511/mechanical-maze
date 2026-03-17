package mapgen

import (
	"math/rand"

	"gobot-roguelike/internal/entity"
)

// CellType 格子类型
type CellType int

const (
	CellWall CellType = iota
	CellFloor
	CellStairs
	CellChest
	CellShop
)

// Cell 地图格子
type Cell struct {
	Type CellType
	Visited bool
}

// LevelMap 一层地图
type LevelMap struct {
	Width    int
	Height   int
	Cells    [][]Cell
	StartX   int
	StartY   int
	StairsX  int
	StairsY  int
	Monsters []*entity.Monster
}

// GenerateLevel 生成一层随机地图
func GenerateLevel(width, height, level int, r *rand.Rand) *LevelMap {
	m := &LevelMap{
		Width: width,
		Height: height,
		Monsters: make([]*entity.Monster, 0),
	}

	// 初始化全墙
	m.Cells = make([][]Cell, height)
	for y := 0; y < height; y++ {
		m.Cells[y] = make([]Cell, width)
		for x := 0; x < width; x++ {
			m.Cells[y][x].Type = CellWall
		}
	}

	// 随机走步法生成洞穴（简单随机地牢算法）
	startX := width / 2
	startY := height / 2
	m.StartX = startX
	m.StartY = startY
	m.Cells[startY][startX].Type = CellFloor
	currentX, currentY := startX, startY

	// 走500步，随机走，每走一步开一个格子
	for i := 0; i < 500; i++ {
		dir := r.Intn(4)
		nx, ny := currentX, currentY
		switch dir {
		case 0: ny--
		case 1: ny++
		case 2: nx--
		case 3: nx++
		}
		// 不出边界就走
		if nx > 1 && nx < width-1 && ny > 1 && ny < height-1 {
			currentX, currentY = nx, ny
			m.Cells[currentY][currentX].Type = CellFloor
		}
	}

	// 找最后走的位置放楼梯
	m.StairsX = currentX
	m.StairsY = currentY
	m.Cells[currentY][currentX].Type = CellStairs

	// 随机放几个宝箱
	numChests := 2 + r.Intn(level)
	for i := 0; i < numChests; i++ {
		m.placeRandomChest(r)
	}

	// 随机放怪物
	numMonsters := 3 + level + r.Intn(level+2)
	for i := 0; i < numMonsters; i++ {
		x, y := m.findRandomEmptyFloor(r)
		if x >= 0 {
			m := entity.NewRandomMonster(level, x, y, r)
			m.Monsters = append(m.Monsters, m)
		}
	}

	// 10%概率出商店
	if r.Intn(100) < 10 {
		x, y := m.findRandomEmptyFloor(r)
		if x >= 0 {
			m.Cells[y][x].Type = CellShop
		}
	}

	return m
}

// placeRandomChest 放一个随机宝箱
func (m *LevelMap) placeRandomChest(r *rand.Rand) {
	x, y := m.findRandomEmptyFloor(r)
	if x >= 0 {
		m.Cells[y][x].Type = CellChest
	}
}

// findRandomEmptyFloor 找个空地板位置
func (m *LevelMap) findRandomEmptyFloor(r *rand.Rand) (int, int) {
	for tries := 0; tries < 100; tries++ {
		x := r.Intn(m.Width-2) + 1
		y := r.Intn(m.Height-2) + 1
		if m.Cells[y][x].Type == CellFloor && m.GetMonsterAt(x, y) == nil {
			return x, y
		}
	}
	return -1, -1
}

// IsWalkable 能不能走
func (m *LevelMap) IsWalkable(x, y int) bool {
	if x < 0 || x >= m.Width || y < 0 || y >= m.Height {
		return false
	}
	// 墙不能走，其他都能走
	return m.Cells[y][x].Type != CellWall
}

// IsStairs 是不是楼梯
func (m *LevelMap) IsStairs(x, y int) bool {
	if x < 0 || x >= m.Width || y < 0 || y >= m.Height {
		return false
	}
	return m.Cells[y][x].Type == CellStairs
}

// IsChest 是不是宝箱
func (m *LevelMap) IsChest(x, y int) bool {
	if x < 0 || x >= m.Width || y < 0 || y >= m.Height {
		return false
	}
	return m.Cells[y][x].Type == CellChest
}

// ClearChest 开了宝箱清空
func (m *LevelMap) ClearChest(x, y int) {
	m.Cells[y][x].Type = CellFloor
}

// GetMonsterAt 获取位置上的怪物
func (m *LevelMap) GetMonsterAt(x, y int) *entity.Monster {
	for _, m := range m.Monsters {
		if m.X == x && m.Y == y {
			return m
		}
	}
	return nil
}

// RemoveMonster 移除怪物
func (m *LevelMap) RemoveMonster(monster *entity.Monster) {
	newList := make([]*entity.Monster, 0, len(m.Monsters)-1)
	for _, m2 := range m.Monsters {
		if m2 != monster {
			newList = append(newList, m2)
		}
	}
	m.Monsters = newList
}
