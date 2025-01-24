'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Code, Home } from 'lucide-react'

const LinearSearch = () => {
  const generateRandomArray = (length = 10) => {
    const arr = Array.from({ length: length - 1 }, () => Math.floor(Math.random() * 90) + 10);
    const targetIndex = Math.floor(Math.random() * length);
    const target = Math.floor(Math.random() * 90) + 10;
    arr.splice(targetIndex, 0, target);
    return { array: arr, target };
  };

  const { array: initialArray, target: initialTarget } = generateRandomArray();
  const [array, setArray] = useState(initialArray);
  const [target, setTarget] = useState(initialTarget);
  const [searching, setSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchSteps, setSearchSteps] = useState([]);
  const [speed, setSpeed] = useState(500);

  const generateLinearSearchSteps = (arr, target) => {
    const steps = [];
    
    steps.push({
      array: [...arr],
      currentIndex: null,
      highlightedLines: [1, 2],
      description: "配列の初期化",
      variables: { target },
      phase: "initialization"
    });

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        currentIndex: i,
        highlightedLines: [3, 4],
        description: `インデックス ${i} の要素 ${arr[i]} を確認`,
        variables: { i, target },
        phase: "checking"
      });

      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          currentIndex: i,
          highlightedLines: [5, 6],
          description: `${target} が見つかりました（インデックス: ${i}）`,
          variables: { i, target },
          found: i,
          phase: "found"
        });
        break;
      }
    }

    if (steps[steps.length - 1].phase !== "found") {
      steps.push({
        array: [...arr],
        currentIndex: null,
        highlightedLines: [10, 11],
        description: `${target} は見つかりませんでした`,
        variables: { target },
        phase: "not-found"
      });
    }

    return steps;
  };

  useEffect(() => {
    setSearchSteps(generateLinearSearchSteps(array, target));
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
    const { array: newArray, target: newTarget } = generateRandomArray();
    setArray(newArray);
    setTarget(newTarget);
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
  
  const linearSearchCode = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // 要素が見つかった場合、そのインデックスを返す
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
          <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 text-center">線形探索</h1>
        </motion.div>

        <motion.div
          className="mt-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">線形探索とは</CardTitle>
              <CardDescription>シンプルで直感的な探索アルゴリズム</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Code className="mr-2 text-gray-500" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">計算量: </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">O(n)</span>
              </div>
              <div className="flex items-start">
                <div className="space-y-4">
                  <p>
                    線形探索は、配列内の各要素を順番に調べて目的の要素を見つける最も基本的な探索アルゴリズムです。
                  </p>
                  <p>
                    配列の先頭から末尾まで順に要素を確認し、目的の要素が見つかった時点で探索を終了します。
                  </p>
                  <div>
                    <h3 className="font-semibold mb-2">アルゴリズムの特徴：</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>実装が非常に簡単</li>
                      <li>ソートされていない配列でも使用可能</li>
                      <li>小規模なデータセットに適している</li>
                      <li>大規模なデータセットでは非効率（平均計算量がO(n)）</li>
                    </ul>
                  </div>
                  <p>
                    シンプルさゆえに、教育目的やデバッグ時によく使用されますが、大規模なデータセットでは他の効率的なアルゴリズム（二分探索など）が好まれます。
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
                      className={`w-12 transition-all duration-200 rounded-t-lg ${
                        currentState.found === index
                          ? 'bg-green-400 dark:bg-green-500'
                          : currentState.currentIndex === index
                          ? 'bg-green-400 dark:bg-green-500'
                          : currentState.currentIndex !== null && index < currentState.currentIndex
                          ? 'bg-green-200 dark:bg-green-700'
                          : 'bg-gray-400 dark:bg-gray-500'
                      }`}
                      style={{ height: `${value * 2}px` }}
                    >
                      <div className="text-center text-white font-bold">{value}</div>
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
                <CardDescription>線形探索のコードと現在の実行行</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                  {linearSearchCode.split('\n').map((line, index) => (
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

export default LinearSearch

