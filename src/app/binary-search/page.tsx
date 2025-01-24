'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Code, Home } from 'lucide-react'

const BinarySearch = () => {
  const generateSortedArray = (length = 15) => {
    return Array.from({ length }, (_, i) => i * 2 + 1);
  };

  const initialArray = generateSortedArray();
  const [array, setArray] = useState(initialArray);
  const [target, setTarget] = useState(Math.floor(Math.random() * 30) + 1);
  const [searching, setSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchSteps, setSearchSteps] = useState([]);
  const [speed, setSpeed] = useState(500);

  const generateBinarySearchSteps = (arr, target) => {
    const steps = [];
    let left = 0;
    let right = arr.length - 1;
    
    steps.push({
      array: [...arr],
      left,
      right,
      mid: null,
      highlightedLines: [1, 2, 3],
      description: "配列の初期化",
      variables: { left, right, target },
      phase: "initialization"
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        array: [...arr],
        left,
        right,
        mid,
        highlightedLines: [5, 6],
        description: `中央の要素を計算: mid = ${mid}`,
        variables: { left, right, mid, target },
        phase: "calculate-mid"
      });

      steps.push({
        array: [...arr],
        left,
        right,
        mid,
        highlightedLines: [8],
        description: `${arr[mid]} と ${target} を比較`,
        variables: { left, right, mid, target },
        comparing: mid,
        phase: "comparison"
      });

      if (arr[mid] === target) {
        steps.push({
          array: [...arr],
          left,
          right,
          mid,
          highlightedLines: [9, 10],
          description: `${target} が見つかりました`,
          variables: { left, right, mid, target },
          found: mid,
          phase: "found"
        });
        break;
      } else if (arr[mid] < target) {
        steps.push({
          array: [...arr],
          left,
          right,
          mid,
          highlightedLines: [11, 12],
          description: `${arr[mid]} < ${target}, 右半分を探索`,
          variables: { left, right, mid, target },
          phase: "move-right"
        });
        left = mid + 1;
      } else {
        steps.push({
          array: [...arr],
          left,
          right,
          mid,
          highlightedLines: [13, 14],
          description: `${arr[mid]} > ${target}, 左半分を探索`,
          variables: { left, right, mid, target },
          phase: "move-left"
        });
        right = mid - 1;
      }
    }

    if (left > right) {
      steps.push({
        array: [...arr],
        left,
        right,
        mid: null,
        highlightedLines: [18, 19],
        description: `${target} は見つかりませんでした`,
        variables: { left, right, target },
        phase: "not-found"
      });
    }

    return steps;
  };

  useEffect(() => {
    setSearchSteps(generateBinarySearchSteps(array, target));
  }, [array, target]);

  const handlePlay = () => setSearching(true);
  const handlePause = () => setSearching(false);
  
  const handleNext = () => {
    if (currentStep < searchSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setSearching(false);
    setCurrentStep(0);
    const newArray = generateSortedArray();
    setArray(newArray);
    setTarget(Math.floor(Math.random() * 30) + 1);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(1000 - value[0]);
  };

  useEffect(() => {
    let timer;
    if (searching && currentStep < searchSteps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else {
      setSearching(false);
    }
    return () => clearTimeout(timer);
  }, [searching, currentStep, searchSteps.length, speed]);

  const currentState = searchSteps[currentStep] || searchSteps[0];
  
  const binarySearchCode = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // 要素が見つかった場合、そのインデックスを返す
    } else if (arr[mid] < target) {
      left = mid + 1; // 右半分を探索
    } else {
      right = mid - 1; // 左半分を探索
    }
  }
  
  return -1; // 要素が見つからなかった場合
}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 py-6">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                ホームに戻る
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 text-center">二分探索</h1>
        </motion.div>

        <motion.div
          className="mt-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">二分探索とは</CardTitle>
              <CardDescription>ソート済み配列に対する効率的な探索アルゴリズム</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Code className="mr-2 text-gray-500" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">計算量: </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">O(log n)</span>
              </div>
              <div className="flex items-start">
                <div className="space-y-4">
                  <p>
                    二分探索は、ソートされた配列内で特定の要素を効率的に見つけるアルゴリズムです。
                  </p>
                  <p>
                    各ステップで探索範囲を半分に絞り込むことで、高速に目的の要素を見つけることができます。
                  </p>
                  <div>
                    <h3 className="font-semibold mb-2">アルゴリズムの特徴：</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>ソート済みの配列に対してのみ適用可能</li>
                      <li>大規模なデータセットに対して非常に効率的（計算量がO(log n)）</li>
                      <li>実装が比較的簡単</li>
                      <li>反復的または再帰的に実装可能</li>
                    </ul>
                  </div>
                  <p>
                    データベースのインデックス検索や、大規模なソート済みデータセットでの検索など、様々な場面で活用されています。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400">デモエリア</CardTitle>
                <CardDescription>配列内で要素が探索される様子を表示</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-end h-64 gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  {currentState?.array.map((value, index) => (
                    <div
                      key={index}
                      className={`w-8 transition-all duration-200 rounded-t-lg ${
                        currentState.found === index
                          ? 'bg-green-400 dark:bg-green-500'
                          : currentState.comparing === index
                          ? 'bg-green-400 dark:bg-green-500'
                          : index >= currentState.left && index <= currentState.right
                          ? 'bg-yellow-400 dark:bg-yellow-500'
                          : 'bg-gray-400 dark:bg-gray-500'
                      }`}
                      style={{ height: `${value * 4}px` }}
                    >
                      <div className="text-center text-white font-bold text-xs">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="font-bold text-gray-800 dark:text-gray-200">探索対象: {target}</p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">{currentState?.description}</p>
                  {currentState?.variables && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Object.entries(currentState.variables).map(([key, value]) => (
                        `${key} = ${value}`
                      )).join(', ')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400">コードエリア</CardTitle>
                <CardDescription>二分探索のコードと現在の実行行</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                  {binarySearchCode.split('\n').map((line, index) => (
                    <div
                      key={index}
                      className={`${
                        currentState?.highlightedLines?.includes(index)
                          ? 'bg-yellow-200 dark:bg-yellow-900'
                          : ''
                      } px-2`}
                    >
                      {line}
                    </div>
                  ))}
                </pre>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4 items-center">
                  <Button onClick={handlePrev} variant="outline" size="icon" className="bg-white dark:bg-gray-700">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button onClick={searching ? handlePause : handlePlay} variant="default" size="icon" className="bg-green-500 hover:bg-green-600 text-white">
                    {searching ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button onClick={handleNext} variant="outline" size="icon" className="bg-white dark:bg-gray-700">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleReset} variant="destructive" size="icon" title="新しいランダム配列を生成" className="bg-red-500 hover:bg-red-600 text-white">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 w-64">
                  <span className="text-sm text-gray-600 dark:text-gray-400">遅い</span>
                  <Slider
                    min={0}
                    max={900}
                    step={1}
                    value={[1000 - speed]}
                    onValueChange={handleSpeedChange}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">速い</span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ステップ: {currentStep + 1} / {searchSteps.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}

export default BinarySearch

