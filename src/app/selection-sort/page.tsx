'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Code, Home } from 'lucide-react'

const SelectionSort = () => {
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

  const generateSelectionSortSteps = (arr) => {
    const steps = [];
    const arrCopy = [...arr];
    const n = arrCopy.length;
    
    steps.push({
      array: [...arrCopy],
      highlightedLines: [1],
      description: "配列の初期化",
      variables: { n: n },
      phase: "initialization"
    });

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      steps.push({
        array: [...arrCopy],
        highlightedLines: [3, 4],
        description: `外部ループ: i = ${i}, 最小値のインデックス初期化`,
        variables: { i, minIndex, n },
        phase: "outer-loop"
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...arrCopy],
          highlightedLines: [5],
          description: `内部ループ: j = ${j}`,
          variables: { i, j, minIndex, n },
          comparing: [minIndex, j],
          phase: "comparison-start"
        });

        steps.push({
          array: [...arrCopy],
          highlightedLines: [6, 7],
          description: `${arrCopy[j]} と ${arrCopy[minIndex]} を比較`,
          variables: { i, j, minIndex, n },
          comparing: [minIndex, j],
          phase: "comparison"
        });

        // 現在の最小値より小さい要素が見つかった場合
        if (arrCopy[j] < arrCopy[minIndex]) {
          minIndex = j;
          steps.push({
            array: [...arrCopy],
            highlightedLines: [7],
            description: `新しい最小値のインデックス: ${minIndex}`,
            variables: { i, j, minIndex, n },
            newMin: minIndex,
            phase: "new-min"
          });
        }
      }

      if (minIndex != i) {
        steps.push({
          array: [...arrCopy],
          highlightedLines: [10, 11],
          description: `${arrCopy[i]} と ${arrCopy[minIndex]} を交換`,
          variables: { i, minIndex, n },
          swapping: [i, minIndex],
          phase: "swap-start"
        });

        [arrCopy[i], arrCopy[minIndex]] = [arrCopy[minIndex], arrCopy[i]];

        steps.push({
          array: [...arrCopy],
          highlightedLines: [11],
          description: "交換完了",
          variables: { i, minIndex, n },
          swapped: [i, minIndex],
          phase: "swap-complete"
        });
      }
    }

    steps.push({
      array: [...arrCopy],
      highlightedLines: [14],
      description: "ソート完了",
      phase: "complete",
      completed: true
    });

    return steps;
  };

  useEffect(() => {
    setSortingSteps(generateSelectionSortSteps(array));
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
  
  const selectionSortCode = `function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex != i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
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
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 text-center">選択ソート</h1>
        </motion.div>

        <motion.div
          className="mt-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">選択ソートとは</CardTitle>
              <CardDescription>シンプルだが非効率なソートアルゴリズムの一つ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Code className="mr-2 text-gray-500" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">計算量: </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">O(n²)</span>
              </div>
              <div className="flex items-start">
                <div className="space-y-4">
                  <p>
                    選択ソートは、配列を繰り返しスキャンし、各パスで最小の要素を見つけて適切な位置に配置することでソートを行うアルゴリズムです。
                  </p>
                  <p>
                    各パスで「選択」された最小要素が正しい位置に配置されることから、この名前が付けられました。
                  </p>
                  <div>
                    <h3 className="font-semibold mb-2">アルゴリズムの特徴：</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>実装が簡単で直感的に理解しやすい</li>
                      <li>バブルソートと同様に、小規模なデータセットに対しては効率的</li>
                      <li>大規模なデータセットに対しては非効率（平均・最悪計算量がO(n²)）</li>
                      <li>不安定ソート（同じ値の要素の相対的な順序が保たれない場合がある）</li>
                      <li>バブルソートよりも一般的に高速（交換回数が少ない）</li>
                    </ul>
                  </div>
                  <p>
                    教育目的でよく使用されますが、実際のアプリケーションでは他の効率的なアルゴリズム（クイックソート、マージソートなど）が好まれます。
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
                          : currentState.newMin === index
                          ? 'bg-yellow-400 dark:bg-yellow-500'
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
                <CardDescription>選択ソートのコードと現在の実行行</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                  {selectionSortCode.split('\n').map((line, index) => (
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

export default SelectionSort

