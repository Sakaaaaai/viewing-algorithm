'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Code, Home } from 'lucide-react'

const QuickSort = () => {
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

  const generateQuickSortSteps = (arr) => {
    const steps = [];
    const arrCopy = [...arr];

    const quickSort = (low, high) => {
      if (low < high) {
        const partitionIndex = partition(low, high);
        quickSort(low, partitionIndex - 1);
        quickSort(partitionIndex + 1, high);
      }
    };

    const partition = (low, high) => {
      const pivot = arrCopy[high];
      steps.push({
        array: [...arrCopy],
        highlightedLines: [2],
        description: `ピボットを選択: ${pivot}`,
        variables: { low, high, pivot },
        pivot: high,
        phase: "partition-start"
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        steps.push({
          array: [...arrCopy],
          highlightedLines: [6],
          description: `${arrCopy[j]} と ${pivot} を比較`,
          variables: { i, j, pivot },
          comparing: [j, high],
          phase: "comparison"
        });

        if (arrCopy[j] < pivot) {
          i++;
          steps.push({
            array: [...arrCopy],
            highlightedLines: [8],
            description: `${arrCopy[i]} と ${arrCopy[j]} を交換`,
            variables: { i, j, pivot },
            swapping: [i, j],
            phase: "swap"
          });
          [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
        }
      }

      steps.push({
        array: [...arrCopy],
        highlightedLines: [13, 14],
        description: `ピボット ${pivot} を正しい位置に配置`,
        variables: { i: i + 1, high },
        swapping: [i + 1, high],
        phase: "pivot-placement"
      });
      [arrCopy[i + 1], arrCopy[high]] = [arrCopy[high], arrCopy[i + 1]];

      return i + 1;
    };

    quickSort(0, arrCopy.length - 1);

    steps.push({
      array: [...arrCopy],
      highlightedLines: [],
      description: "ソート完了",
      phase: "complete",
      completed: true
    });

    return steps;
  };

  useEffect(() => {
    setSortingSteps(generateQuickSortSteps(array));
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
  
  const quickSortCode = `function quickSort(arr, low, high) {
  if (low < high) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const partitionIndex = i + 1;

    quickSort(arr, low, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, high);
  }
  return arr;
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
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 text-center">クイックソート</h1>
        </motion.div>

        <motion.div
          className="mt-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">クイックソートとは</CardTitle>
              <CardDescription>効率的で広く使用されている分割統治アルゴリズム</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Code className="mr-2 text-gray-500" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">平均計算量: </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">O(n log n)</span>
              </div>
              <div className="flex items-start">
                <div className="space-y-4">
                  <p>
                    クイックソートは、配列を分割し、再帰的にソートする効率的なアルゴリズムです。
                  </p>
                  <p>
                    ピボットと呼ばれる要素を選び、それを基準に配列を2つの部分に分割します。この過程を再帰的に繰り返すことで、全体をソートします。
                  </p>
                  <div>
                    <h3 className="font-semibold mb-2">アルゴリズムの特徴：</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>平均的に非常に効率的（O(n log n)）</li>
                      <li>インプレースソートが可能（追加のメモリをほとんど使用しない）</li>
                      <li>大規模なデータセットに対して効果的</li>
                      <li>ピボットの選択方法により性能が変わる</li>
                    </ul>
                  </div>
                  <p>
                    その効率性から、実際のアプリケーションで広く使用されています。ただし、最悪の場合の計算量はO(n²)となる可能性があります。
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
                          : currentState.pivot === index
                          ? 'bg-red-400 dark:bg-red-500'
                          : currentState.comparing?.includes(index)
                          ? 'bg-blue-400 dark:bg-blue-500'
                          : currentState.swapping?.includes(index)
                          ? 'bg-yellow-400 dark:bg-yellow-500'
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
                <CardDescription>クイックソートのコードと現在の実行行</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                  {quickSortCode.split('\n').map((line, index) => (
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

export default QuickSort

