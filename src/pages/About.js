import React, { useState, useRef, useEffect } from 'react';
import { CozeAPI, ChatEventType, RoleType } from '@coze/api';
import { useNavigate } from 'react-router-dom';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { MMarkdown } from '@myun/gimi-design';
// import ShowMarkdown from '../components/show-markdown/markdown.js';
import '../pages/About.css';

//23
const About = () => {
  // 所有状态变量和useRef都在组件顶层作用域
  const navigate = useNavigate();
  const [step, setStep] = useState('selectedIdentity'); // selectedIdentity, editor, initial - 现在身份选择在第一个
  const [editorContent, setEditorContent] = useState('');
  const [formattedTasks, setFormattedTasks] = useState([]);
  const [isTaskListLocked, setIsTaskListLocked] = useState(false);
  const editorRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedIdentity, setSelectedIdentity] = useState(() => {
    // 从localStorage读取保存的身份选择索引
    const savedIdentity = localStorage.getItem('selectedIdentity');
    return savedIdentity !== null ? parseInt(savedIdentity, 10) : null;
  }); // 默认未选中任何身份，确保按钮禁用状态正常工作
  const [identityInput, setIdentityInput] = useState(() => {
    // 从localStorage读取保存的自定义身份输入
    return localStorage.getItem('identityInput') || '';
  }); // 用于存储输入框的值
  const [showModal, setShowModal] = useState(false); // 控制模态弹窗显示/隐藏
  const [messageList, setMessageList] = useState([]);
  const [status, setStatus] = useState(0); // 0 没输入内容 1 正在输入 2 ai正在回复 3 ai即将回复
  const controllerRef = useRef(null); // 发起对话接口controller
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(true);
  const buttonTimerRef = useRef(null);
  const [countdown, setCountdown] = useState(5);
  const [hasCountdownStarted, setHasCountdownStarted] = useState(false);

    const valueRef = useRef(null);
    const cozeRef = useRef(null); // 扣子实例
        const [conversationId, setConversationId] = useState(''); // 会话id
    const errRef = useRef({
        timer: null,
        count: 0,
    });


  const [paper, setPaper] = useState({
    botId: '7564251548717727787',
    accessToken: 'pat_t5xJCB10cSORLoDoW10doS6L6LGYmi6ubgQFeEfFwMbRfUABVn4QvmqFsAM4bJjY',
  });


  // 处理身份确认
  const handleIdentityConfirm = () => {
    // 保存选择的身份到localStorage
    if (selectedIdentity !== null) {
      localStorage.setItem('selectedIdentity', selectedIdentity.toString());

      // 获取身份显示名称并更新userIdentity字段
      const identityMap = [
        { id: 0, name: '十八线小爱豆', emoji: '🎤' },
        { id: 1, name: '职场小牛马', emoji: '💼' },
        { id: 2, name: '复仇黑莲花', emoji: '🖤' },
        { id: 3, name: '鸡排主理人', emoji: '🍗' },
        { id: 4, name: '霸道豪门总裁', emoji: '💎' },
        { id: 5, name: '玄学风水大师', emoji: '🔮' }
      ];
      const selected = identityMap.find(item => item.id === selectedIdentity);
      if (selected) {
        localStorage.setItem('userIdentity', `${selected.emoji} ${selected.name}`);
      }
    } else if (identityInput.trim()) {
      localStorage.setItem('identityInput', identityInput.trim());
      localStorage.removeItem('selectedIdentity');
      // 更新userIdentity字段为自定义身份
      localStorage.setItem('userIdentity', identityInput.trim());
    }

    // 显示模态弹窗
    setShowModal(true);

    // 调用API获取回复
    streamChatApi();
  };

  // 获取AI回复
  const fetchAIResponse = async () => {
    try {
      setStatus(2); // AI正在回复

      // 创建AbortController用于控制请求
      const controller = new AbortController();
      controllerRef.current = controller;

      // 准备发送给AI的消息
      const customIdentity = identityInput.trim();
      let identityInfo;

      if (customIdentity) {
        identityInfo = `用户自定义身份：${customIdentity}`;
      } else {
        const identityMap = [
          { id: 0, name: '十八线小爱豆', emoji: '🎤' },
          { id: 1, name: '职场小牛马', emoji: '💼' },
          { id: 2, name: '复仇黑莲花', emoji: '🖤' },
          { id: 3, name: '鸡排主理人', emoji: '🍗' },
          { id: 4, name: '霸道豪门总裁', emoji: '💎' },
          { id: 5, name: '玄学风水大师', emoji: '🔮' }
        ];
        const selected = identityMap.find(item => item.id === selectedIdentity);
        identityInfo = `用户选择身份：${selected.emoji} ${selected.name}`;
      }

      // 模拟AI回复，实际项目中应该调用真实API
      // 这里使用setTimeout来模拟网络请求延迟
      setTimeout(() => {
        const responseContent = `
# 身份确认成功 🎉

你现在的身份是：**${identityInfo}**

## 接下来的故事将围绕你的身份展开

准备好开始你的学习之旅了吗？
        `;

        setMessageList([{
          content: responseContent,
          role: 'assistant'
        }]);
        setStatus(3); // AI回复完成

        // 开始倒计时
        startCountdown();
      }, 2000);

    } catch (error) {
      console.error('获取AI回复失败:', error);
      setStatus(0);
    }
  };

   // 初始化coze
  const initCoze = () => {
    if (!cozeRef.current) {
      cozeRef.current = new CozeAPI({
        token: paper.accessToken,
        baseURL: 'https://api.coze.cn',
        allowPersonalAccessTokenInBrowser: true,
      });
      createConversation();
    }
  };

   // 创建会话
    const createConversation = () => {
        //@ts-nocheck
        return new Promise(async (resolve, reject) => {
            try {
                console.log('开始创建会话，botId:', paper.botId);
                const res = await cozeRef.current.conversations.create({
                    bot_id: paper.botId,
                });
                console.log('创建会话响应:', res);
                if (res?.id) {
                    setConversationId(res.id);
                    console.log('会话ID已设置:', res.id);
                    resolve(1);
                } else {
                    console.error('会话创建失败，响应中没有ID');
                    // message.error('服务异常');
                    resolve(2);
                }
            } catch (error) {
                console.error('创建会话时出错:', error);
                // message.error('服务异常');
                resolve(2);
            }
        });
    };

const streamChatApi = async (msg,again) => {
   console.log('开始调用streamChatApi，会话ID:', conversationId);
    // 正确获取finalContent，不需要再次trim，因为存储时已经格式化过了
    const finalContent = localStorage.getItem('finalContent') || '';
    try {
      controllerRef.current = new AbortController();
      
      // 确保conversationId存在
      console.log('conversationId',conversationId)
      if (!conversationId) {
        console.error('会话ID不存在，无法发起请求');
        return;
      }

      console.log('准备发送流式请求',`${identityInput.trim()}`);
      await fetchEventSource(`https://api.coze.cn/v3/chat`, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'text/event-stream',
          // 'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${paper.accessToken}`,
        },
        signal: controllerRef.current.signal,
        openWhenHidden: true,
        body: JSON.stringify({
          stream: true,
          bot_id: paper.botId,
          user_id: '1234',
          // conversation_id: conversationId,
          conversation_id: conversationId,
          additional_messages: [
            {
              role: RoleType.User,
              content: `
              # 场景设定
                ${localStorage.getItem('userIdentity') || ''}
              # ToDo list
              ${localStorage.getItem('finalContent') || ''}`,
              content_type: 'text',
            },
          ],
          // extra_params:{
          //  input_identity:'复仇黑莲花',
          //  input_todo:'1、背50个单词 2、看1h托福课程视频3、做30道语法题 4、做一套托福试卷 5、进行一场口语模拟训练',
          // }
        }),
        onopen(response) {
          console.log('Connection opened! 响应状态:', response.status, '响应头:', response.headers.get('content-type'));
          if (response.status !== 200) {
            console.error('连接打开失败，状态码:', response.status);
          }
          return Promise.resolve();
        },
        onmessage(event) {
          console.log('收到消息事件:', event.type, '事件数据长度:', event.data.length);
          
          try {
            const part = {
              ...event,
              data: JSON.parse(event.data),
            };
            
            console.log('解析后的消息事件类型:', part.event);

            // 当前返回错误
            if (part.event === ChatEventType.ERROR) {
              console.error('收到错误事件:', part.data);
              // handleError();
              return;
            }
            // 当前创建好会话
            if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
              console.log('会话创建成功，会话ID:', part.data.conversation_id);
              setConversationId(part.data.conversation_id);
              setStatus(2);
            }
            // 当前会话完成
            if (part.event === ChatEventType.DONE) {
              console.log('会话完成');
              valueRef.current ? setStatus(1) : setStatus(0);
            }

          if (
              part.event === ChatEventType.CONVERSATION_CHAT_CREATED ||
              part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA ||
              (part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED && part.data.type === 'answer')
            ) {
              console.log('更新消息列表，事件类型:', part.event);
              setMessageList((prev) => {
                if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
                  if (!again) {
                    errRef.current = {
                      count: 0,
                      timer: null,
                    };
                  }
                  return again && prev[prev.length - 1]?.type === 'answer'
                    ? [
                      ...prev.slice(0, -1),
                      {
                        ...part.data,
                        type: 'answer',
                        role: 'assistant',
                        content: '',
                        chat_id: part.data.chat_id || part.data.id,
                        loading: true,
                      },
                    ]
                    : [
                      ...prev,
                      {
                        ...part.data,
                        type: 'answer',
                        role: 'assistant',
                        content: '',
                        chat_id: part.data.chat_id || part.data.id,
                        loading: true,
                      },
                    ];
                }
                if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
                  const newContent = prev[prev.length - 1].content + (part.data.content || '');
                  console.log('收到消息增量，当前内容长度:', newContent.length);
                  return [...prev.slice(0, -1), { ...prev[prev.length - 1], content: newContent }];
                }
                if (part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
                  console.log('消息完成');
                  return [...prev.slice(0, -1), { ...prev[prev.length - 1], loading: false }];
                }
                return prev;
              });
            }
          } catch (parseError) {
            console.error('解析消息事件数据失败:', parseError, '原始数据:', event.data);
          }
        },
        onerror(error) {
          // 避免在错误处理中再次尝试中止控制器，这可能导致额外错误
          // handleError();
          // 不抛出错误，避免阻止后续操作
        },
        onclose() {
          console.log('连接已关闭，检查是否有错误或取消操作');
        },
      });
    } catch (error) {
      // 正确处理AbortError，这是用户主动取消请求时会产生的错误
      if (error.name !== 'AbortError') {
        // 只有非中止错误才需要处理
        // handleError();
      }
    }
  };



  // 开始倒计时
  const startCountdown = () => {
    if (!hasCountdownStarted) {
      setHasCountdownStarted(true);
      setIsStartButtonDisabled(true);
      setCountdown(5);

      buttonTimerRef.current = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(buttonTimerRef.current);
            setIsStartButtonDisabled(false);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
  };

  // 关闭模态弹窗
  const closeModal = () => {
    // 清除倒计时定时器
    if (buttonTimerRef.current) {
      clearInterval(buttonTimerRef.current);
    }

    // 隐藏模态框
    setShowModal(false);

    // 重置状态
    setMessageList([]);
    setStatus(0);
    setIsStartButtonDisabled(true);
    setCountdown(5);
    setHasCountdownStarted(false);
  };

  // 处理编辑器内容变化
  const handleEditorChange = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  // 处理确认按钮点击
  const handleConfirmButtonClick = () => {
    // 将用户输入的内容按行分割，并过滤空行
    const newTasks = editorContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // 将新任务追加到现有任务列表中，避免覆盖快捷按钮添加的任务
    const updatedTasks = [...new Set([...formattedTasks, ...newTasks])];

    // 设置更新后的任务列表
    setFormattedTasks(updatedTasks);

    // 清空输入框
    setEditorContent('');

    // 保存空的编辑器内容到localStorage
    localStorage.setItem('editorContent', '');

    // 保存更新后的任务到localStorage
    localStorage.setItem('formattedTasks', JSON.stringify(updatedTasks));
  };

  // 处理告诉按钮点击
  const handleTellButtonClick = () => {
    setStep('selectedIdentity');
  };
  

  // 组件挂载时的初始化
  useEffect(() => {
    // 从localStorage加载编辑器内容
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      setEditorContent(savedContent);
    }

    // 从localStorage加载格式化后的任务列表
    const savedTasks = localStorage.getItem('formattedTasks');
    if (savedTasks) {
      try {
        setFormattedTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('解析保存的任务列表失败:', error);
      }
    }

    // 加载锁定状态，但默认应该是未锁定
    const savedLockedState = localStorage.getItem('isTaskListLocked');
    // 安全地处理锁定状态 - 只有当明确是'true'字符串时才锁定
    const shouldLock = savedLockedState === 'true';
    setIsTaskListLocked(shouldLock);
    // 确保localStorage中的值是布尔字符串格式
    localStorage.setItem('isTaskListLocked', shouldLock.toString());

  }, []);
  
  // 监听messageList变化，当有内容时自动启用开始按钮
  useEffect(() => {
    if (messageList[0]?.content) {
      setIsStartButtonDisabled(false);
    }
  }, [messageList]);

  useEffect(() => {
    initCoze()
  }, [])



console.log('messageList',messageList)

  return (
    <div className="page about-page">
      {step === 'selectedIdentity' && (
        <div className="identity-layout-container">
          {/* 左侧介绍区域 */}
          <div className="identity-intro-section">
            <div className="about-decoration">
              <svg className="about-icon" width="80" height="80" viewBox="0 0 100 100">
                <path
                  d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10z"
                  fill="#667eea"
                  fillOpacity="0.8"
                />
                <path
                  d="M50 15c24.9 0 45 20.1 45 45S74.9 105 50 105 5 84.9 5 60s20.1-45 45-45z"
                  fill="#764ba2"
                  fillOpacity="0.6"
                />
                <path
                  d="M50 25c13.8 0 25 11.2 25 25s-11.2 25-25 25-25-11.2-25-25 11.2-25 25-25z"
                  fill="white"
                />
                <path
                  d="M50 35c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10z"
                  fill="#667eea"
                />
              </svg>
            </div>
            <h2 className="intro-title">智演小布</h2>
            <p className="intro-subtitle">将平凡的任务，变成非凡的故事</p>
            <p className="intro-text">
              不是冰冷的学习待办清单，而是为你量身定制故事的小布
            </p>
            <p className="intro-text">
              我会根据您选定的身份和待办清单，通过AI智能构建多情节故事。在您完成对应情节的清单任务后，系统会解锁下一任务的故事，让学习打卡过程从机械罗列变为沉浸式故事解锁！
            </p>
          </div>

          {/* 右侧身份选择区域 */}
          <div className="identity-selection-section">
            <h2 className="identity-title">请选择你的今日身份</h2>
            <div className="identity-options">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`identity-item ${selectedIdentity === index ? 'selected' : ''}`}
                  style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', cursor: 'pointer' }}
                  onClick={() => {
                    // 当点击身份选项时，清空输入框
                    setSelectedIdentity(index);
                    setIdentityInput('');
                  }}
                >
                  <div className="identity-image" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px' }}>
                    {/* 优化图片显示 */}
                    <div style={{ width: '140px', height: '140px', overflow: 'hidden', borderRadius: '8px' }}>
                      {index === 0 && <img
                        src='https://simg01.gaodunwangxiao.com/uploadimgs/tmp/upload/202510/22/60c86_20251022181516.png'
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt="十八线小爱豆"
                      />}
                      {index === 1 && <img
                        src='https://simg01.gaodunwangxiao.com/uploadimgs/tmp/upload/202510/22/9c1f8_20251022181643.jpg'
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt="职场小牛马"
                      />}
                      {index === 2 && <img
                        src='https://simg01.gaodunwangxiao.com/uploadimgs/tmp/upload/202510/22/9d7db_20251022181617.jpg'
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt="复仇黑莲花"
                      />}
                      {index === 3 && <img
                        src='https://simg01.gaodunwangxiao.com/uploadimgs/tmp/upload/202510/24/2d02e_20251024115812.png'
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt="鸡排主理人"
                      />}
                      {index === 4 && <img
                        src='https://simg01.gaodunwangxiao.com/uploadimgs/tmp/upload/202510/24/7f8cf_20251024115851.png'
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt="霸道豪门总裁"
                      />}
                      {index === 5 && <img
                        src='https://simg01.gaodunwangxiao.com/uploadimgs/tmp/upload/202510/24/9d9ac_20251024115924.png'
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt="玄学风水大师"
                      />}
                    </div>
                  </div>
                  <div className="identity-name" style={{ marginTop: '8px', textAlign: 'center', fontSize: '1rem' }}>
                    {index === 0 && '十八线小爱豆'}
                    {index === 1 && '职场小牛马'}
                    {index === 2 && '复仇黑莲花'}
                    {index === 3 && '鸡排主理人'}
                    {index === 4 && '霸道豪门总裁'}
                    {index === 5 && '玄学风水大师'}
                  </div>
                  {selectedIdentity === index && (
                    <div className="identity-checkmark" style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#4CAF50', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 添加输入框 */}
            <div className="identity-input-button-container">
              <div className="identity-input-container">
                <input
                  type="text"
                  className="identity-input"
                  placeholder="自定义身份"
                  aria-label="自定义身份"
                  value={identityInput}
                  onChange={(e) => {
                    setIdentityInput(e.target.value);
                    // 当输入框有任何内容时，立即清空已选身份
                    setSelectedIdentity(null);
                  }}
                />
              </div>

              <button
                className="identity-confirm-button"
                onClick={() => {
                  // 保存用户选择的身份并显示模态弹窗
                  // handleIdentityConfirm();
                  setStep('editor');
                  // 这边如何获取到用户选择的身份
                  const userIdentity = selectedIdentity !== null ? (selectedIdentity === 0 ? '十八线小爱豆' : selectedIdentity === 1 ? '职场小牛马' : selectedIdentity === 2 ? '复仇黑莲花' : selectedIdentity === 3 ? '鸡排主理人' : selectedIdentity === 4 ? '霸道豪门总裁' : '玄学风水大师') : identityInput.trim();
                  // 存储用户选择的身份到 localStorage
                  localStorage.setItem('userIdentity', userIdentity);
                  // 不再立即切换到编辑器，而是在关闭模态弹窗时切换
                }}
                disabled={selectedIdentity === null && !identityInput.trim()}
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      )}



      {step === 'editor' && (
        <div className="content-container editor-page">
          <button
            className="back-button"
            onClick={() => setStep('selectedIdentity')}
            aria-label="返回上一步"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="editor-header">
            <h2 className="editor-title">记录你的想法</h2>
            <p className="editor-subtitle">将你的计划和任务写下来，让小布为你创造精彩故事</p>
          </div>

          {/* 身份展示卡片 */}
          <div className="identity-card">
            <div className="identity-info">
              <span className="identity-badge">今日身份</span>
              <span className="identity-name">{localStorage.getItem('userIdentity') || '未选择'}</span>
            </div>
          </div>

          {/* 常驻的todo list - 优化样式 */}
          <div className="todo-list-container">
            <div className="todo-list inline-todo-list">
              <div
                className="todo-item"
                onClick={() => {
                  const task = '背50个单词';
                  let newTasks;
                  if (!formattedTasks.includes(task)) {
                    // 如果任务不存在，则添加
                    newTasks = [...formattedTasks, task];
                  } else {
                    // 如果任务已存在，则移除
                    newTasks = formattedTasks.filter(t => t !== task);
                  }
                  setFormattedTasks(newTasks);
                  localStorage.setItem('formattedTasks', JSON.stringify(newTasks));
                }}
              >
                <div className={`todo-checkbox ${formattedTasks.includes('背50个单词') ? 'checked' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    {formattedTasks.includes('背50个单词') ? (
                      <>
                        <circle cx="10" cy="10" r="9" fill="#667eea" stroke="#667eea" strokeWidth="2" />
                        <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    ) : (
                      <circle cx="10" cy="10" r="9" fill="white" stroke="#e0e0e0" strokeWidth="2" />
                    )}
                  </svg>
                </div>
                <span className="todo-text">背50个单词</span>
              </div>
              <div
                className="todo-item"
                onClick={() => {
                  const task = '看1h托福课程视频';
                  let newTasks;
                  if (!formattedTasks.includes(task)) {
                    // 如果任务不存在，则添加
                    newTasks = [...formattedTasks, task];
                  } else {
                    // 如果任务已存在，则移除
                    newTasks = formattedTasks.filter(t => t !== task);
                  }
                  setFormattedTasks(newTasks);
                  localStorage.setItem('formattedTasks', JSON.stringify(newTasks));
                }}
              >
                <div className={`todo-checkbox ${formattedTasks.includes('看1h托福课程视频') ? 'checked' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    {formattedTasks.includes('看1h托福课程视频') ? (
                      <>
                        <circle cx="10" cy="10" r="9" fill="#667eea" stroke="#667eea" strokeWidth="2" />
                        <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    ) : (
                      <circle cx="10" cy="10" r="9" fill="white" stroke="#e0e0e0" strokeWidth="2" />
                    )}
                  </svg>
                </div>
                <span className="todo-text">看1h托福课程视频</span>
              </div>
            </div>
          </div>

          {/* 左右布局的主体内容和任务列表 */}
          <div className="main-content-wrapper">
            {/* 左侧：输入区域和按钮 */}
            <div className="left-panel">
              <div className="input-section">
                {/* <label htmlFor="task-textarea" className="input-label">
                  输入你的任务
                  <span className="character-count">{editorContent.length}/500</span>
                </label> */}
                <textarea
                  id="task-textarea"
                  className="task-textarea"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value.slice(0, 500))}
                  placeholder="1，输入你的任务2，发啥地方"
                  rows={6}
                />
                {/* <p className="input-hint">💡 提示：每行输入一个任务，效果更佳</p> */}
              </div>

              {/* 确定按钮 - 优化样式 */}
              <button
                className={`confirm-button ${!editorContent.trim() ? 'disabled' : ''}`}
                onClick={handleConfirmButtonClick}
                disabled={!editorContent.trim()}
              >
                确定
                <svg width="20" height="20" viewBox="0 0 24 24" className="button-icon">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" />
                </svg>
              </button>
            </div>

            {/* 右侧：任务列表显示区域 - 优化样式 */}
            <div className="right-panel">
              {formattedTasks.length > 0 ? (
                <div className="formatted-tasks-container animate-fadeIn">
                  <div className="section-header">
                    <h3 className="formatted-tasks-title">你的任务清单</h3>
                    <span className="section-decoration"></span>
                  </div>
                  <div className="formatted-tasks">
                    {formattedTasks.map((task, index) => (
                      <div key={index} className="formatted-task-item animate-slideIn">
                        <div className="task-badge">
                          {index + 1}
                        </div>
                        <span className="task-content">{task}</span>
                        <button
                          className="remove-task-btn"
                          onClick={(e) => {
                            e.stopPropagation(); // 阻止冒泡，避免触发父元素的点击事件
                            const newTasks = formattedTasks.filter((t, i) => i !== index);
                            setFormattedTasks(newTasks);
                            localStorage.setItem('formattedTasks', JSON.stringify(newTasks));
                          }}
                          aria-label="移除任务"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4H14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M5 4V2C5 1.44772 5.44772 1 6 1H10C10.5523 1 11 1.44772 11 2V4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 8V12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M5 12H11" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="list-footer">
                    <span className="task-count">共 {formattedTasks.length} 项任务</span>
                    <div className="list-actions">

                      <button
                        className="clear-tasks-btn"
                        onClick={() => {
                          if (!isTaskListLocked) {
                            setFormattedTasks([]);
                            localStorage.removeItem('formattedTasks');
                          }
                        }}
                        disabled={isTaskListLocked}
                        title={isTaskListLocked ? "任务清单已锁定，无法清空" : "清空任务清单"}
                      >
                        清空清单
                      </button>
                      <button
                        className={`lock-tasks-btn ${isTaskListLocked ? 'locked' : ''}`}
                        onClick={() => {
                          // 1. 先格式化和保存任务清单
                          console.log('formattedTasks', formattedTasks);
                          const formattedContent = formattedTasks
                            .map((task, index) => `${index + 1}，${task}`)
                            .join(' ');
                          localStorage.setItem('finalContent', formattedContent);
                          
                          // 2. 然后执行身份确认和API调用
                          handleIdentityConfirm();
                        }}

                        title={isTaskListLocked ? "点击解锁任务清单，双击强制解锁" : "点击锁定任务清单"}
                      >
                        开启任务
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-task-list">
                  <p className="empty-task-message">暂无任务清单</p>
                  <p className="empty-task-hint">添加任务后将在此显示</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}



      {/* 模态弹窗组件 */}
      {showModal && (
        <div className="modal-overlay identity-confirm-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">场景设定</h3>
            </div>
            {!messageList[0]?.content && (
              <div className="modal-body">
                <div className="modal-animation">
                  <div className="loading-spinner-container">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                    >
                      <defs>
                        <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="url(#spinnerGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="80"
                        strokeDashoffset="60"
                        className="spinner-circle"
                      />
                    </svg>
                  </div>
                  <p className="loading-text">正在为你生成个性化体验...</p>
                </div>
                <div className="modal-message">
                  <div className="identity-preview-container">
                    <p className="identity-label">你的身份</p>
                    <p className="identity-preview">
                      {(() => {
                        const customIdentity = identityInput.trim();
                        if (customIdentity) {
                          return (
                            <span className="custom-identity">{customIdentity}</span>
                          );
                        }

                        const identityMap = [
                          { id: 0, name: '十八线小爱豆', emoji: '🎤' },
                          { id: 1, name: '职场小牛马', emoji: '💼' },
                          { id: 2, name: '复仇黑莲花', emoji: '🖤' },
                          { id: 3, name: '鸡排主理人', emoji: '🍗' },
                          { id: 4, name: '霸道豪门总裁', emoji: '💎' },
                          { id: 5, name: '玄学风水大师', emoji: '🔮' }
                        ];

                        const selected = identityMap.find(item => item.id === selectedIdentity);
                        return selected ? `${selected.emoji} ${selected.name}` : '未选择';
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {messageList[0]?.content && (
              <div style={{ minHeight: '315px' }}>
                <MMarkdown content={messageList[0]?.content} />
              </div>
            )}
            <div className="modal-footer">
              <button
                className={`modal-button confirm ${isStartButtonDisabled ? 'disabled' : ''}`}
                style={{
                  backgroundColor: isStartButtonDisabled ? '#ccc' : '',
                  cursor: isStartButtonDisabled ? 'not-allowed' : 'pointer',
                  opacity: isStartButtonDisabled ? 0.6 : 1
                }}
                onClick={() => {
                  closeModal();
                  // 关闭模态弹窗后跳转到Home页面
                  navigate('/Home');
                }}
                disabled={isStartButtonDisabled}
              >
                {!messageList[0]?.content ? '准备中' : '开始学习'}
              </button>
              <button
                className="modal-button cancel"
                onClick={() => {
                  // 中止流式请求
                  if (controllerRef.current) {
                    controllerRef.current.abort();
                    // 清空控制器引用
                    controllerRef.current = null;
                  }
                  // 重置消息列表
                  setMessageList([]);
                  // 重置状态
                  setStatus(0);
                  // 隐藏模态框
                  setShowModal(false);
                  // 清除倒计时定时器
                  if (buttonTimerRef.current) {
                    clearInterval(buttonTimerRef.current);
                  }
                  // 重置按钮状态、倒计时和倒计时标记
                  setIsStartButtonDisabled(true);
                  setCountdown(5);
                  setHasCountdownStarted(false);
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;