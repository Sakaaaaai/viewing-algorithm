'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Code, Home } from 'lucide-react'

const MergeSort = () => {
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

  const generateMergeSortSteps = (arr) => {
    const steps = [];
    const arrCopy = [...arr];
    
    steps.push({
      array: [...arrCopy],
      highlightedLines: [1, 2],
      description: "配列の初期化",
      variables: { n: arrCopy.length },
      phase: "initialization"
    });

    const merge = (left, right, start, end) => {
      let result = [];
      let leftIndex = 0;
      let rightIndex = 0;
      let k = start;

      while (leftIndex < left.length && rightIndex < right.length) {
        steps.push({
          array: [...arrCopy],
          highlightedLines: [13, 14, 15],
          description: `${left[leftIndex]} と ${right[rightIndex]} を比較`,
          variables: { leftIndex, rightIndex },
          comparing: [start + leftIndex, start + left.length + rightIndex],
          phase: "comparison"
        });

        if (left[leftIndex] <= right[rightIndex]) {
          result.push(left[leftIndex]);
          arrCopy[k] = left[leftIndex];
          leftIndex++;
        } else {
          result.push(right[rightIndex]);
          arrCopy[k] = right[rightIndex];
          rightIndex++;
        }
        k++;

        steps.push({
          array: [...arrCopy],
          highlightedLines: [16, 17, 18, 19, 20, 21],
          description: "要素をマージ",
          variables: { leftIndex, rightIndex, k },
          merged: [k - 1],
          phase: "merge"
        });
      }

      while (leftIndex < left.length) {
        result.push(left[leftIndex]);
        arrCopy[k] = left[leftIndex];
        leftIndex++;
        k++;
        steps.push({
          array: [...arrCopy],
          highlightedLines: [25, 26, 27],
          description: "左側の残りの要素をマージ",
          variables: { leftIndex, k },
          merged: [k - 1],
          phase: "merge-left"
        });
      }

      while (rightIndex < right.length) {
        result.push(right[rightIndex]);
        arrCopy[k] = right[rightIndex];
        rightIndex++;
        k++;
        steps.push({
          array: [...arrCopy],
          highlightedLines: [30, 31, 32],
          description: "右側の残りの要素をマージ",
          variables: { rightIndex, k },
          merged: [k - 1],
          phase: "merge-right"
        });
      }

      return result;
    };

    const mergeSortRecursive = (start, end) => {
      if (start < end) {
        const mid = Math.floor((start + end) / 2);
        
        steps.push({
          array: [...arrCopy],
          highlightedLines: [4, 5, 6],
          description: `配列を分割 (${start} to ${mid}, ${mid + 1} to ${end})`,
          variables: { start, mid, end },
          dividing: [start, mid, end],
          phase: "divide"
        });

        mergeSortRecursive(start, mid);
        mergeSortRecursive(mid + 1, end);

        const left = arrCopy.slice(start, mid + 1);
        const right = arrCopy.slice(mid + 1, end + 1);

        merge(left, right, start, end);
      }
    };

    mergeSortRecursive(0, arrCopy.length - 1);

    steps.push({
      array: [...arrCopy],
      highlightedLines: [36],
      description: "ソート完了",
      phase: "complete",
      completed: true
    });

    return steps;
  };

  useEffect(() => {
    setSortingSteps(generateMergeSortSteps(array));
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
  
  const mergeSortCode = `function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
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
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 text-center">マージソート</h1>
        </motion.div>

        <motion.div
          className="mt-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">マージソートとは</CardTitle>
              <CardDescription>効率的で安定したソートアルゴリズム</CardDescription>
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
                    マージソートは、分割統治法を用いた効率的なソートアルゴリズムです。配列を再帰的に半分に分割し、
                    ソートされた部分配列をマージしていくことで全体をソートします。
                  </p>
                  <div>
                    <h3 className="font-semibold mb-2">アルゴリズムの特徴：</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>安定ソート（同じ値の要素の相対的な順序が保たれる）</li>
                      <li>大規模なデータセットに対して効率的（計算量がO(n log n)）</li>
                      <li>追加のメモリ空間が必要（元の配列のコピーを作成）</li>
                      <li>並列処理に適している</li>
                    </ul>
                  </div>
                  <p>
                    マージソートは、大規模データの外部ソートや、連結リストのソートなど、様々な場面で活用されています。
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
                          ? 'bg-yellow-400 dark:bg-yellow-500'
                          : currentState.merged?.includes(index)
                          ? 'bg-blue-400 dark:bg-blue-500'
                          : currentState.dividing?.includes(index)
                          ? 'bg-red-400 dark:bg-red-500'
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
                <CardDescription>マージソートのコードと現在の実行行</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                  {mergeSortCode.split('\n').map((line, index) => (
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

export default MergeSort

