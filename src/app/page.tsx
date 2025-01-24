"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowRight, Code, Zap } from "lucide-react"

const AnimatedText = ({ text }: { text: string }) => {
  return (
    <motion.h2
      className="text-3xl font-bold mb-8 text-indigo-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  )
}

const algorithmCategories = [
  {
    name: "ソートアルゴリズム",
    algorithms: [
      {
        name: "選択ソート",
        description: "未ソート部分から最小要素を選択し、ソート済み部分の末尾に追加していくアルゴリズム",
        path: "/selection-sort",
        complexity: "O(n²)",
        funFact: "メモリ書き込み回数が少ないため、特定のシナリオで有用です。",
      },
      {
        name: "挿入ソート",
        description: "配列を順次走査し、各要素を適切な位置に挿入していくソートアルゴリズム",
        path: "/insertion-sort",
        complexity: "O(n²)",
        funFact: "小規模なデータセットや、ほぼソートされたデータに対して効率的です。",
      },
      {
        name: "バブルソート",
        description: "隣接する要素を比較し、順序が逆なら入れ替える単純なソートアルゴリズム",
        path: "/bubble-sort",
        complexity: "O(n²)",
        funFact: "単純だが非効率なアルゴリズムの代表例です。",
      },
      {
        name: "クイックソート",
        description: "分割統治法を用いた高速なソートアルゴリズム",
        path: "/quick-sort",
        complexity: "O(n log n)",
        funFact: "平均的には最も高速なソートアルゴリズムの一つです。",
      },
      {
        name: "マージソート",
        description: "分割統治法を用いた安定的なソートアルゴリズム",
        path: "/merge-sort",
        complexity: "O(n log n)",
        funFact: "大規模データの外部ソートに適しています。",
      },
      {
        name: "ヒープソート",
        description: "ヒープデータ構造を使用した効率的なソートアルゴリズム",
        path: "/heap-sort",
        complexity: "O(n log n)",
        funFact: "インプレースソートであり、大規模データセットに効果的です。",
      },
    ],
  },
  {
    name: "探索アルゴリズム",
    algorithms: [
      {
        name: "線形探索",
        description: "配列の各要素を順番に調べる単純な探索アルゴリズム",
        path: "/linear-search",
        complexity: "O(n)",
        funFact: "小規模なデータセットや未ソートのデータに適しています。",
      },
      {
        name: "二分探索",
        description: "ソート済みの配列で特定の値を高速に検索するアルゴリズム",
        path: "/binary-search",
        complexity: "O(log n)",
        funFact: "電話帳で名前を探すときの戦略と似ています。",
      },
    ],
  },
  {
    name: "グラフアルゴリズム",
    algorithms: [
      {
        name: "深さ優先探索 (DFS)",
        description: "グラフの各分岐を深く探索していく手法",
        path: "/dfs",
        complexity: "O(V + E)",
        funFact: "迷路解きのアルゴリズムとして使われることがあります。",
      },
      {
        name: "幅優先探索 (BFS)",
        description: "グラフの各層を順に探索していく手法",
        path: "/bfs",
        complexity: "O(V + E)",
        funFact: "最短経路問題を解くのに適しています。",
      },
    ],
  },
  {
    name: "動的計画法",
    algorithms: [
      {
        name: "ナップサック問題",
        description: "重さと価値のバランスを取るアイテム選択問題",
        path: "/knapsack",
        complexity: "O(nW)",
        funFact: "テーブルの更新過程をアニメーション表示できます。",
      },
      {
        name: "最長共通部分列 (LCS)",
        description: "2つの文字列間で最長の共通部分列を見つける",
        path: "/lcs",
        complexity: "O(mn)",
        funFact: "バイオインフォマティクスでDNA配列の比較に使用されます。",
      },
      {
        name: "階段問題",
        description: "n段の階段を登る方法の数を求める",
        path: "/climbing-stairs",
        complexity: "O(n)",
        funFact: "フィボナッチ数列と密接な関係があります。",
      },
    ],
  },
  {
    name: "幾何アルゴリズム",
    algorithms: [
      {
        name: "最近傍探索",
        description: "2D平面上で最も近い点を探索",
        path: "/nearest-neighbor",
        complexity: "O(n log n)",
        funFact: "点間の距離を比較するアニメーションで視覚化できます。",
      },
      {
        name: "凸包問題",
        description: "点の集合の中で最小の凸多角形を見つける",
        path: "/convex-hull",
        complexity: "O(n log n)",
        funFact: "コンピュータグラフィックスや衝突検出に応用されます。",
      },
    ],
  },
  {
    name: "文字列アルゴリズム",
    algorithms: [
      {
        name: "KMPアルゴリズム",
        description: "効率的な部分文字列検索",
        path: "/kmp",
        complexity: "O(n + m)",
        funFact: "パターンマッチングの基本的なアルゴリズムです。",
      },
      {
        name: "ラビン-カープアルゴリズム",
        description: "ハッシュを用いた部分文字列探索",
        path: "/rabin-karp",
        complexity: "O(n + m)",
        funFact: "複数のパターンを同時に検索する場合に効果的です。",
      },
      {
        name: "トライ木",
        description: "文字列を効率的に格納するデータ構造",
        path: "/trie",
        complexity: "O(m)",
        funFact: "オートコンプリート機能の実装に使用されることがあります。",
      },
    ],
  },
]

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-16">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            見るアルゴリズムとデータ構造
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">アルゴリズムとデータ構造を視覚的に理解できるサイト</p>
        </motion.div>

        {algorithmCategories.map((category, categoryIndex) => (
          <div key={category.name} className="mb-16">
            <AnimatedText text={category.name} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {category.algorithms.map((algo, algoIndex) => (
                <motion.div
                  key={algo.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.2 + algoIndex * 0.1 }}
                  onHoverStart={() => setHoveredIndex(categoryIndex * 100 + algoIndex)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-indigo-600">{algo.name}</CardTitle>
                      <CardDescription className="text-gray-600">{algo.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-4">
                        <Code className="mr-2 text-indigo-500" />
                        <span className="font-semibold text-gray-700">計算量: </span>
                        <span className="ml-2 text-indigo-600 font-mono">{algo.complexity}</span>
                      </div>
                      <div className="flex items-start">
                        <Lightbulb className="mr-2 text-yellow-500 mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{algo.funFact}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={algo.path} className="w-full">
                        <Button
                          className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-300"
                          variant="default"
                        >
                          学習する
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

