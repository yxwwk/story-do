import React, { useState, useEffect, useRef } from 'react';
import FloatingBubble from '../FloatingBubble';
import SnowEffect from '../SnowEffect';
import SnowToggle from '../SnowToggle';
import '../SnowToggle.css';
import './Home.css';
import '../components/TaskCardStyles.css';
import SuccessPage from '../components/SuccessPage';
import TaskCard1 from '../components/TaskCard';
import TaskCard2 from '../components/TaskCard2';
import TaskCard3 from '../components/TaskCard3';
import TaskCard4 from '../components/TaskCard4';
import TaskCard5 from '../components/TaskCard5';
import TaskCard6 from '../components/TaskCard6';
import TaskCard7 from '../components/TaskCard7';
import TaskCard8 from '../components/TaskCard8';
import { CozeAPI, ChatEventType, RoleType } from '@coze/api';
import { fetchEventSource } from '@microsoft/fetch-event-source';


const Home = () => {
  const [isSnowing, setIsSnowing] = useState(false); // 雪花状态，默认为关闭
  const cozeRef = useRef(null); // 扣子实例
  const [conversationId, setConversationId] = useState(''); // 会话id
  const valueRef = useRef(null);
  const [messageList, setMessageList] = useState([]);
  const messageListRef = useRef(messageList); // 用于在回调中访问最新的messageList
  const controllerRef = useRef(null); // 发起对话接口controller
  const [status, setStatus] = useState(0); // 0 没输入内容 1 正在输入 2 ai正在回复 3 ai即将回复
  const [msgLoading, setMsgLoading] = useState(false); // 网络不佳的loading
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true); // 页面加载状态
  const userIdentity = localStorage.getItem('identityInput') || '';
  const finalContent = localStorage.getItem('finalContent') || '';
  const errRef = useRef({
    timer: null,
    count: 0,
  });
  const [paper, setPaper] = useState({
    botId: '7563851131408039946',
    accessToken: 'pat_t5xJCB10cSORLoDoW10doS6L6LGYmi6ubgQFeEfFwMbRfUABVn4QvmqFsAM4bJjY',
  });
  const conversationId2 = localStorage.getItem('conversationId2')
    const chat_id = localStorage.getItem('id2')
  // 定义任务数据，只包含id、文本和完成状态，坐标将在组件内部管理
  const [tasks, setTasks] = useState([
    {}
    // { id: 'aaaa', text: '背诵50个单词', levelPlot: '清晨的魔法城堡里，你坐在梳妆台前，镜中映出水晶灯下摊开的单词本。今天是你逆袭计划的第一天，仙女教母留下的魔法笔记上写着：每个单词都是通往城堡的阶梯。你拿起羽毛笔，在月光般的书页上轻轻勾勒生词，每背完一个，窗外就传来一声清脆的鸟鸣，仿佛在为你加油。当最后一个单词合上笔记本时，你发现镜中的自己眼神多了几分坚定，单词本上的字迹也泛着淡淡的金光。', isCompleted: false },
    // { id: 'bbbb', text: '看一个视频', levelPlot: '午后的图书馆里，阳光透过彩绘玻璃洒在翻开的平板电脑上。你戴上降噪耳机，点开仙女教母推荐的托福课程视频。屏幕里，Grammer教授正用魔法粉笔在虚拟黑板上绘制复杂的句子结构图，那些曾经让你头疼的从句和时态，此刻都变成了跳动的星星。当视频结束时，你发现自己不仅看懂了所有难点，还在笔记本上画满了可爱的语法小精灵。', isCompleted: false },
    // { id: 'cccc', text: '做一套题', levelPlot: '午后的图书馆里，阳光透过彩绘玻璃洒在翻开的平板电脑上。你戴上降噪耳机，点开仙女教母推荐的托福课程视频。屏幕里，Grammer教授正用魔法粉笔在虚拟黑板上绘制复杂的句子结构图，那些曾经让你头疼的从句和时态，此刻都变成了跳动的星星。当视频结束时，你发现自己不仅看懂了所有难点，还在笔记本上画满了可爱的语法小精灵。', isCompleted: false },
    // { id: 'dddd', text: '做一套题', levelPlot: '午后的图书馆里，阳光透过彩绘玻璃洒在翻开的平板电脑上。你戴上降噪耳机，点开仙女教母推荐的托福课程视频。屏幕里，Grammer教授正用魔法粉笔在虚拟黑板上绘制复杂的句子结构图，那些曾经让你头疼的从句和时态，此刻都变成了跳动的星星。当视频结束时，你发现自己不仅看懂了所有难点，还在笔记本上画满了可爱的语法小精灵。', isCompleted: false },
    // { id: 'eeee', text: '做一套题', levelPlot: '午后的图书馆里，阳光透过彩绘玻璃洒在翻开的平板电脑上。你戴上降噪耳机，点开仙女教母推荐的托福课程视频。屏幕里，Grammer教授正用魔法粉笔在虚拟黑板上绘制复杂的句子结构图，那些曾经让你头疼的从句和时态，此刻都变成了跳动的星星。当视频结束时，你发现自己不仅看懂了所有难点，还在笔记本上画满了可爱的语法小精灵。', isCompleted: false },
    // { id: 'ffff', text: '做一套题', levelPlot: '清晨的魔法城堡里，你坐在梳妆台前，镜中映出水晶灯下摊开的单词本。今天是你逆袭计划的第一天，仙女教母留下的魔法笔记上写着：每个单词都是通往城堡的阶梯。你拿起羽毛笔，在月光般的书页上轻轻勾勒生词，每背完一个，窗外就传来一声清脆的鸟鸣，仿佛在为你加油。当最后一个单词合上笔记本时，你发现镜中的自己眼神多了几分坚定，单词本上的字迹也泛着淡淡的金光。', isCompleted: false },
    // { id: 'gggg', text: '做一套题', levelPlot: '清晨的魔法城堡里，你坐在梳妆台前，镜中映出水晶灯下摊开的单词本。今天是你逆袭计划的第一天，仙女教母留下的魔法笔记上写着：每个单词都是通往城堡的阶梯。你拿起羽毛笔，在月光般的书页上轻轻勾勒生词，每背完一个，窗外就传来一声清脆的鸟鸣，仿佛在为你加油。当最后一个单词合上笔记本时，你发现镜中的自己眼神多了几分坚定，单词本上的字迹也泛着淡淡的金光。', isCompleted: false },
    // { id: 'hhhh', text: 'hhhh', isCompleted: false }
  ]);

  const imgB = 'https://simg01.gaodunwangxiao.com/uploadimgs/tmp/upload/202510/22/69af8_20251022155738.png'
  // const imgB = 'https://simg01.gaodunwangxiao.com/uploadimgs/tmp/upload/202510/22/69af8_20251022155738.png'
  // 拖拽状态管理
  const [dragState, setDragState] = useState({
    isDragging: false,
    taskId: null,
    offsetX: 0,
    offsetY: 0
  });

  // 连接线逻辑已移至各个TaskCard组件内部

  // 切换雪花效果
  const toggleSnow = () => {
    setIsSnowing(prev => !prev);
  };

  // 下雪完成时自动关闭开关
  const handleSnowComplete = () => {
    setIsSnowing(false);
  };

  // 切换任务完成状态（添加任务锁功能）
  const toggleTaskCompletion = (taskId, event) => {
    // 如果正在拖拽，不切换完成状态
    if (dragState.isDragging) return;

    // 找到当前任务的索引
    const currentTaskIndex = tasks.findIndex(task => task.id === taskId);

    // 任务锁逻辑：检查前置任务是否已完成
    // 对于索引为1的任务（第二个任务），只有当索引为0的任务（第一个任务）已完成时才能切换状态
    // 对于索引为2的任务（第三个任务），只有当索引为1的任务（第二个任务）已完成时才能切换状态
    if (currentTaskIndex > 0) {
      const previousTask = tasks[currentTaskIndex - 1];
      if (!previousTask.isCompleted) {
        // 前置任务未完成，无法完成当前任务
        return;
      }
    }

    // 可以切换任务完成状态
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  // 开始拖拽
  const handleDragStart = (taskId, event) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // 计算鼠标点击位置相对于任务卡片左上角的偏移量
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    setDragState({
      isDragging: true,
      taskId,
      offsetX,
      offsetY
    });

    // 添加视觉反馈
    event.currentTarget.style.zIndex = '10';
    event.currentTarget.style.transform = 'scale(1.05)';
    event.currentTarget.style.cursor = 'grabbing';
  };

  // 拖拽中
  const handleDragMove = (event) => {
    if (!dragState.isDragging) return;

    const taskFlowEl = document.querySelector('.task-flow');
    if (!taskFlowEl) return;

    const taskFlowRect = taskFlowEl.getBoundingClientRect();

    // 计算新位置，确保任务卡片保持在task-flow容器内
    let newX = event.clientX - taskFlowRect.left - dragState.offsetX;
    let newY = event.clientY - taskFlowRect.top - dragState.offsetY;

    // 边界检查
    const cardWidth = 150;
    const cardHeight = 120;
    newX = Math.max(0, Math.min(taskFlowRect.width - cardWidth, newX));
    newY = Math.max(0, Math.min(taskFlowRect.height - cardHeight, newY));

    // 更新任务位置
    setTasks(tasks.map(task =>
      task.id === dragState.taskId
        ? { ...task, x: newX, y: newY }
        : task
    ));
  };

  // 结束拖拽
  const handleDragEnd = () => {
    if (!dragState.isDragging) return;

    // 重置拖拽状态
    setDragState({
      isDragging: false,
      taskId: null,
      offsetX: 0,
      offsetY: 0
    });

    // 恢复视觉效果
    const taskEl = document.getElementById(dragState.taskId);
    if (taskEl) {
      taskEl.style.zIndex = '';
      taskEl.style.transform = '';
      taskEl.style.cursor = 'grab';
    }
  };

  // 添加全局鼠标/触摸事件监听
  useEffect(() => {
    if (dragState.isDragging) {
      const handleMouseMove = (event) => handleDragMove(event);
      const handleMouseUp = () => handleDragEnd();
      const handleTouchMove = (event) => handleDragMove(event.touches[0]);
      const handleTouchEnd = () => handleDragEnd();

      // 添加事件监听器
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      // 清理事件监听器
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [dragState]);



  // 响应式调整任务位置
  useEffect(() => {
    // 任务位置计算已移至各个TaskCard组件内部
    // 这里保持空的useEffect以维持原有结构，但移除了位置计算逻辑
  }, []);

  // 检查是否所有任务都已完成
  const allTasksCompleted = tasks.every(task => task.isCompleted);

  // 处理重新开始功能
  const handleRestart = () => {
    setTasks(tasks.map(task => ({ ...task, isCompleted: false })));
  };


  // 初始化coze
  const initCoze = () => {
    

      // 延迟3秒调用yu函数
      setTimeout(() => {
        yu(conversationId2, chat_id);
      }, 3000);

    // if (!cozeRef.current) {
    //   cozeRef.current = new CozeAPI({
    //     token: paper.accessToken,
    //     baseURL: 'https://api.coze.cn',
    //     allowPersonalAccessTokenInBrowser: true,
    //   });
    //   createConversation();
    // }
  };


  // // 创建会话
  // const createConversation = () => {
  //   //@ts-nocheck
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const res = await cozeRef.current.conversations.create({
  //         bot_id: paper.botId,
  //       });
  //       if (res?.id) {
  //         setConversationId(res.id);
  //         streamChatApi(res.id)
  //         resolve(1);
  //       } else {
  //         // message.error('服务异常');
  //         resolve(2);
  //       }
  //     } catch (error) {
  //       // message.error('服务异常');
  //       resolve(2);
  //     }
  //   });
  // };

  const streamChatApi = async (id, again) => {
    console.log('获取历史数据API', id, again)
    try {
      controllerRef.current = new AbortController();

      // 使用普通fetch请求替代fetchEventSource
      const response = await fetch(`https://api.coze.cn/v3/chat/message/list?conversation_id=${localStorage.getItem('conversationId2')}}&chat_id=${localStorage('id2')}}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${paper.accessToken}`,
        },
        signal: controllerRef.current.signal,
        body: JSON.stringify({
          stream: false,
          bot_id: paper.botId,
          user_id: '4ff',
          additional_messages: [
            {
              role: '878',
              content: `
              # 场景设定
                ${localStorage.getItem('userIdentity') || ''}
              # ToDo list
              ${localStorage.getItem('finalContent') || ''}`,
              content_type: 'text',
            },
          ],
        }),
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      // 解析响应数据
      const responseData = await response.json();
      console.log('API响应数据:', responseData);
      // 延迟10秒后调用yu函数
      setTimeout(() => {
        yu(responseData.data.conversation_id, responseData.data.id);
      }, 12000);


    } catch (error) {
      console.log('Error:', error);
      // handleError();
    }
  };

  // 轮询计数器和定时器引用
  const [pollCount, setPollCount] = useState(0);
  const pollTimerRef = useRef(null);

  const yu = async (conversation_id, chat_id) => {
    // 重置轮询计数器
    setPollCount(0);
    
    // 执行轮询
    const pollForData = async (count = 0) => {
      try {
        controllerRef.current = new AbortController();

        // 使用普通fetch请求替代fetchEventSource
        const response = await fetch(`https://api.coze.cn/v3/chat/message/list?conversation_id=${conversation_id}&chat_id=${chat_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${paper.accessToken}`,
          },
          signal: controllerRef.current.signal,
        });

        // 检查响应状态
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }

        // 解析响应数据
        const responseData = await response.json();
        console.log('-------API响应数据333------:', responseData.data);
        console.log('当前轮询次数:', count);
        
        // 只有当responseData.data存在且有数据时才进行处理
        if (responseData.data && responseData.data.length) {
          // 检查是否有type为answer的元素
          const hasAnswerElement = responseData.data.some(element => element.type === "answer");
          
          if (!hasAnswerElement && count < 6) {
            // 如果没有answer类型的元素且轮询次数小于6次，继续轮询
            console.log('没有找到answer类型的元素，3秒后继续轮询...');
            setPollCount(count + 1);
            pollTimerRef.current = setTimeout(() => {
              pollForData(count + 1);
            }, 3000);
            return; // 终止当前函数执行
          } else {
            // 处理数据
            responseData.data.forEach(element => {
              console.log('element33333333-------', element)
              console.log('element33333333', element.type)
              if (element.type === "answer") {
                const parsedOutput = JSON.parse(element.content);
                console.log('99999element', parsedOutput);
                // setData(parsedOutput);

                // 处理任务列表数据，添加isCompleted属性并映射ID
                const processedTasks = parsedOutput.level_list.map(task => {
                  // ID映射逻辑：将数字ID转换为对应的字母ID格式
                  const idMap = {
                    1: 'aaaa',
                    2: 'bbbb',
                    3: 'cccc',
                    4: 'dddd',
                    5: 'eeee',
                    6: 'ffff',
                    7: 'gggg',
                    8: 'hhhh',
                    9: 'iiii',
                    10: 'jjjj',
                  };

                  // 确保idMap中有对应的映射，否则使用默认值
                  const mappedId = idMap[task.id] || `task_${task.id}`;

                  return {
                  ...task,
                    id: mappedId,
                    isCompleted: false,
                    image_url: task.image_url || parsedOutput.image_list[task.id-1] || '',
                  };
                });

                setTasks(processedTasks);
                setLoading(false);
                console.log('处理后的任务列表:', processedTasks);
              }
            });
          }
        }
        
        // 当数据为空或已达到最大轮询次数时，关闭loading
        if ((!responseData.data || !responseData.data.length) || 
            (responseData.data && responseData.data.length && 
             !responseData.data.some(element => element.type === "answer") && 
             count >= 6)) {
          setLoading(false);
        }
      } catch (error) {
        console.error('轮询API时出错:', error);
        // 如果发生错误且轮询次数小于6次，继续轮询
        if (count < 8) {
          console.log('发生错误，3秒后继续轮询...');
          setPollCount(count + 1);
          pollTimerRef.current = setTimeout(() => {
            pollForData(count + 1);
          }, 3000);
        } else {
          setLoading(false);
        }
      }
    };
    
    // 开始第一次轮询
    pollForData();
  };
  
  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    initCoze();
  }, []);





  // 监听messageList变化，更新ref
  useEffect(() => {
    messageListRef.current = messageList;
  }, [messageList]);

  console.log('-----data67676767-----', data)
  console.log('-----tasks67676767-----', tasks)
  return (
    <div className="page home-page task-flow-container">
      {/* 优化的加载状态显示 */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(6px)',
          transition: 'opacity 0.3s ease-out'
        }}>
          {/* 动画加载图标容器 */}
          <div style={{
            width: '120px',
            height: '120px',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            {/* 装饰性背景圆环 */}
            <svg width="100" height="100" viewBox="0 0 100 100" style={{ position: 'absolute' }}>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e0e7ff"
                strokeWidth="4"
              />
            </svg>

            {/* 主旋转动画 */}
            <svg style={{ animation: 'spin 2s linear infinite' }} width="80" height="80" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="url(#loadingGradient)"
                strokeWidth="5"
                strokeDasharray="130 40"
                strokeLinecap="round"
                strokeDashoffset="0"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.3))' }}
              />
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.8; transform: scale(1.05); }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
                @keyframes fadeInOut {
                  0%, 100% { opacity: 0.4; }
                  50% { opacity: 1; }
                }
              `}</style>
            </svg>

            {/* 中心点装饰 */}
            <div style={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
          </div>

          {/* 加载文本 */}
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1e40af',
            textAlign: 'center',
            animation: 'float 2s ease-in-out infinite',
            textShadow: '0 2px 4px rgba(30, 64, 175, 0.1)'
          }}>
            魔法故事正在加载中...
          </div>

          {/* 加载提示 */}
          <div style={{
            fontSize: '16px',
            color: '#64748b',
            marginTop: '12px',
            opacity: 0.9,
            animation: 'fadeInOut 2.5s ease-in-out infinite'
          }}>
            请稍候，精彩即将呈现 ✨
          </div>

          {/* 装饰性粒子 */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '20%',
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            animation: 'float 3s ease-in-out infinite',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.7)'
          }} />
          <div style={{
            position: 'absolute',
            top: '25%',
            right: '25%',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'rgba(139, 92, 246, 0.5)',
            animation: 'float 4s ease-in-out infinite 0.5s',
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.7)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '30%',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            animation: 'float 3.5s ease-in-out infinite 1s',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.7)'
          }} />
        </div>
      )}
      {/* 雪花效果组件 - 条件渲染 */}
      {isSnowing && <SnowEffect onSnowComplete={handleSnowComplete} />}

      {/* 雪花开关组件 - 只在任务未全部完成时显示 */}
      {!allTasksCompleted && <SnowToggle isSnowing={isSnowing} onToggle={toggleSnow} />}

      {/* 根据任务完成状态条件渲染 */}
      {allTasksCompleted ? (
        <SuccessPage
          tasks={tasks}
          onRestart={handleRestart}
        />
      ) : (
        <div className="task-flow">
          {/* 连接线已移至各个TaskCard组件内部渲染 */}

          {/* 渲染任务卡片 - 根据任务数量选择不同的组件 */}
          <div className="tasks" style={{
            // backgroundImage: `url(${imgB})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>
            {tasks.map((task, index) => {
              const taskCount = tasks.length;
              return ( 
                <TaskCard5
                  key={task.id}
                  task={task}
                  index={index}
                  taskCount={taskCount}
                  dragState={dragState}
                  toggleTaskCompletion={toggleTaskCompletion}
                  handleDragStart={handleDragStart}
                  tasks={tasks}
                />
              );
              // 根据任务数量选择不同的组件
              // if (taskCount === 2) {
              //   return <TaskCard2
              //     key={task.id}
              //     task={task}
              //     index={index}
              //     taskCount={taskCount}
              //     dragState={dragState}
              //     toggleTaskCompletion={toggleTaskCompletion}
              //     handleDragStart={handleDragStart}

              //   />;
              // } else if (taskCount === 3) {
              //   return <TaskCard3
              //     key={task.id}
              //     task={task}
              //     index={index}
              //     taskCount={taskCount}
              //     dragState={dragState}
              //     toggleTaskCompletion={toggleTaskCompletion}
              //     handleDragStart={handleDragStart}
              //     tasks={tasks}
              //   />;
              // } else if (taskCount === 4) {
              //   return <TaskCard4
              //     key={task.id}
              //     task={task}
              //     index={index}
              //     taskCount={taskCount}
              //     dragState={dragState}
              //     toggleTaskCompletion={toggleTaskCompletion}
              //     handleDragStart={handleDragStart}
              //     tasks={tasks}
              //   />;
              // } else if (taskCount === 5) {
              //   return <TaskCard5
              //     task={task}
              //     index={index}
              //     taskCount={taskCount}
              //     dragState={dragState}
              //     toggleTaskCompletion={toggleTaskCompletion}
              //     handleDragStart={handleDragStart}
              //     tasks={tasks}
              //   />;
              // } else if (taskCount === 6) {
              //   return <TaskCard6
              //     key={task.id}
              //     task={task}
              //     index={index}
              //     taskCount={taskCount}
              //     dragState={dragState}
              //     toggleTaskCompletion={toggleTaskCompletion}
              //     handleDragStart={handleDragStart}
              //     tasks={tasks}
              //   />;
              // } else if (taskCount === 7) {
              //   return <TaskCard7
              //     key={task.id}
              //     task={task}
              //     index={index}
              //     taskCount={taskCount}
              //     dragState={dragState}
              //     toggleTaskCompletion={toggleTaskCompletion}
              //     handleDragStart={handleDragStart}
              //     tasks={tasks}
              //   />;
              // } else if (taskCount === 8) {
              //   return <TaskCard8
              //     key={task.id}
              //     task={task}
              //     index={index}
              //     taskCount={taskCount}
              //     dragState={dragState}
              //     toggleTaskCompletion={toggleTaskCompletion}
              //     handleDragStart={handleDragStart}

              //   />;
              // } else {
              //   // 默认使用TaskCard1（原TaskCard）
              //   return <div
              //     key={task.id}
              //     id={task.id}
              //     className={`task-card ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
              //     style={{
              //       left: `${100 + index * 200}px`,
              //       top: `${100 + (index % 2) * 150}px`,
              //       cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab'
              //     }}
              //     onClick={(event) => toggleTaskCompletion(task.id, event)}
              //     onMouseDown={(event) => handleDragStart(task.id, event)}
              //     onTouchStart={(event) => handleDragStart(task.id, event.touches[0])}
              //   >
              //     <div className="task-image">
              //       <div className="mountain-icon">
              //         <svg viewBox="0 0 40 30" width="40" height="30">
              //           <polygon points="0,30 20,10 40,30" fill="#3b82f6" />
              //           <polygon points="5,30 20,15 35,30" fill="#60a5fa" />
              //         </svg>
              //         {task.isCompleted && (
              //           <div className="completion-check">
              //             <svg viewBox="0 0 20 20" width="20" height="20">
              //               <circle cx="10" cy="10" r="8" fill="#22c55e" />
              //               <path d="M5,10 L8,13 L15,6" stroke="white" strokeWidth="2" fill="none" />
              //             </svg>
              //           </div>
              //         )}
              //       </div>
              //     </div>
              //     <div className="task-text">{task.text}</div>
              //   </div>;
              // }
            })}
          </div>
        </div>
      )}

      {!allTasksCompleted && <FloatingBubble />}
    </div>
  );
};

export default Home;