'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Code, Home } from 'lucide-react'

const HeapSort = () => {
  const generateRandomArray = (length = 7) => {
    return Array.from({ length }, () => 
      Math.floor(Math.random() * 90) + 10
    );
  };

  const initialArray = generateRandomArray();
  const [array, setArray] = useState(initialArray);
  const [sorting, setSorting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sortingSteps, setSortingSteps] = useState([]);
  const [speed, setSpeed] = useState(500);

  const generateHeapSortSteps = (arr) => {
    const steps = [];
    const arrCopy = [...arr];
    const n = arrCopy.length;
    
    steps.push({
      array: [...arrCopy],
      highlightedLines: [1, 2],
      description: "配列の初期化",
      variables: { n: n },
      phase: "initialization"
    });

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      steps.push({
        array: [...arrCopy],
        highlightedLines: [4, 5],
        description: `ヒープの構築: i = ${i}`,
        variables: { i },
        phase: "build-heap"
      });
      heapify(arrCopy, n, i, steps);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      steps.push({
        array: [...arrCopy],
        highlightedLines: [7, 8],
        description: `ルート要素と最後の要素を交換: ${arrCopy[0]} と ${arrCopy[i]}`,
        swapping: [0, i],
        phase: "swap-start"
      });

      // Move current root to end
      [arrCopy[0], arrCopy[i]] = [arrCopy[i], arrCopy[0]];

      steps.push({
        array: [...arrCopy],
        highlightedLines: [8],
        description: "交換完了",
        swapped: [0, i],
        phase: "swap-complete"
      });

      steps.push({
        array: [...arrCopy],
        highlightedLines: [9],
        description: `ヒープサイズを縮小してヒープ化: i = ${i}`,
        variables: { i },
        phase: "heapify-reduced"
      });
      heapify(arrCopy, i, 0, steps);
    }

    steps.push({
      array: [...arrCopy],
      highlightedLines: [10],
      description: "ソート完了",
      phase: "complete",
      completed: true
    });

    return steps;
  };

  const heapify = (arr, n, i, steps) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push({
      array: [...arr],
      highlightedLines: [13, 14, 15, 16],
      description: `ノード ${i} のヒープ化開始`,
      variables: { n, i, left, right },
      comparing: [i, left, right].filter(x => x < n),
      phase: "heapify-start"
    });

    if (left < n && arr[left] > arr[largest]) {
      steps.push({
        array: [...arr],
        highlightedLines: [18, 19],
        description: `左の子 ${arr[left]} が現在の最大値 ${arr[largest]} より大きい`,
        variables: { largest: left },
        comparing: [largest, left],
        phase: "heapify-compare-left"
      });
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      steps.push({
        array: [...arr],
        highlightedLines: [21, 22],
        description: `右の子 ${arr[right]} が現在の最大値 ${arr[largest]} より大きい`,
        variables: { largest: right },
        comparing: [largest, right],
        phase: "heapify-compare-right"
      });
      largest = right;
    }

    if (largest !== i) {
      steps.push({
        array: [...arr],
        highlightedLines: [25, 26],
        description: `${arr[i]} と ${arr[largest]} を交換`,
        variables: { i, largest },
        swapping: [i, largest],
        phase: "heapify-swap"
      });

      [arr[i], arr[largest]] = [arr[largest], arr[i]];

      steps.push({
        array: [...arr],
        highlightedLines: [26],
        description: "交換完了",
        variables: { i, largest },
        swapped: [i, largest],
        phase: "heapify-swap-complete"
      });

      steps.push({
        array: [...arr],
        highlightedLines: [27],
        description: `サブツリーのヒープ化を継続`,
        variables: { n, largest },
        phase: "heapify-recurse"
      });
      heapify(arr, n, largest, steps);
    }
  };

  useEffect(() => {
    setSortingSteps(generateHeapSortSteps(array));
  }, [array]);

  const handlePlay = () => setSorting(true);
  const handlePause = () => setSorting(false);
  
  const handleNext = () => {
    if (currentStep < sortingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setSorting(false);
    setCurrentStep(0);
    const newArray = generateRandomArray();
    setArray(newArray);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(1000 - value[0]);
  };

  useEffect(() => {
    let timer;
    if (sorting && currentStep < sortingSteps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else {
      setSorting(false);
    }
    return () => clearTimeout(timer);
  }, [sorting, currentStep, sortingSteps.length, speed]);

  const currentState = sortingSteps[currentStep] || sortingSteps[0];
  
  const heapSortCode = `function heapSort(arr) {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest])
    largest = left;

  if (right < n && arr[right] > arr[largest])
    largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 py-6">
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
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 text-center">ヒープソート</h1>
        </motion.div>

        <motion.div
          className="mt-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">ヒープソートとは</CardTitle>
              <CardDescription>効率的で安定しないソートアルゴリズム</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Code className="mr-2 text-gray-500" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">計算量: </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">O(n log n)</span>
              </div>
              <div className="flex items-start">
                <div className="space-y-4">
                  <p>
                    ヒープソートは、ヒープデータ構造を利用して配列をソートするアルゴリズムです。
                    最大ヒープ（または最小ヒープ）を構築し、それを利用してソートを行います。
                  </p>
                  <div>
                    <h3 className="font-semibold mb-2">アルゴリズムの特徴：</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>効率的な計算量（O(n log n)）を持つ</li>
                      <li>追加のメモリ空間をほとんど必要としない（in-place sorting）</li>
                      <li>大規模なデータセットに対しても効率的</li>
                      <li>不安定ソート（同じ値の要素の相対的な順序が保たれない可能性がある）</li>
                    </ul>
                  </div>
                  <p>
                    ヒープソートは、クイックソートやマージソートと並んで、大規模データの効率的なソートに適しています。
                    特に、最悪の場合でもO(n log n)の計算量を保証する点が特徴的です。
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
                <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">デモエリア</CardTitle>
                <CardDescription>配列の要素がソートされる様子を表示</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-end h-64 gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  {currentState?.array.map((value, index) => (
                    <div
                      key={index}
                      className={`w-12 transition-all duration-200 rounded-t-lg ${
                        currentState.completed
                          ? 'bg-green-400 dark:bg-green-500'
                          : currentState.comparing?.includes(index)
                          ? 'bg-blue-400 dark:bg-blue-500'
                          : currentState.swapping?.includes(index)
                          ? 'bg-yellow-400 dark:bg-yellow-500'
                          : currentState.swapped?.includes(index)
                          ? 'bg-green-400 dark:bg-green-500'
                          : 'bg-gray-400 dark:bg-gray-500'
                      }`}
                      style={{ height: `${value * 2}px` }}
                    >
                      <div className="text-center text-white font-bold">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
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
                <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">コードエリア</CardTitle>
                <CardDescription>ヒープソートのコードと現在の実行行</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                  {heapSortCode.split('\n').map((line, index) => (
                    <div
                      key={index}
                      className={`${
                        currentState?.highlightedLines?.includes(index + 1)
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
                  <Button onClick={sorting ? handlePause : handlePlay} variant="default" size="icon" className="bg-blue-500 hover:bg-blue-600 text-white">
                    {sorting ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
                  ステップ: {currentStep + 1} / {sortingSteps.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}

export default HeapSort

