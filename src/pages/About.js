import React, { useState, useRef, useEffect } from 'react';
import { CozeAPI, ChatEventType, RoleType } from '@coze/api';
import { useNavigate } from 'react-router-dom';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { MMarkdown } from '@myun/gimi-design';
// import ShowMarkdown from '../components/show-markdown/markdown.js';
import '../pages/About.css';
import { replace } from 'react-router-dom';

const About = () => {
  // 所有状态变量和useRef都在组件顶层作用域
  const [step, setStep] = useState('initial'); // initial, editor, options, selectedIdentity
  const [editorContent, setEditorContent] = useState('');
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
  const [countdown, setCountdown] = useState(5); // 倒计时秒数
  const [hasCountdownStarted, setHasCountdownStarted] = useState(false); // 标记是否已经开始过倒计时
  const valueRef = useRef(null);
  const errRef = useRef({
    timer: null,
    count: 0,
  });
  const [conversationId, setConversationId] = useState(''); // 会话id
  const [finalContent, setFinalContent] = useState(() => {
    // 从localStorage读取保存的编辑内容
    return localStorage.getItem('finalContent') || '';
  }); // 存储最终编辑的内容
  const navigate = useNavigate();
  const [paper, setPaper] = useState({
    botId: '7564251548717727787',
    accessToken: 'pat_t5xJCB10cSORLoDoW10doS6L6LGYmi6ubgQFeEfFwMbRfUABVn4QvmqFsAM4bJjY',
  });
  const cozeRef = useRef(null); // 扣子实例
  
  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (buttonTimerRef.current) {
        clearInterval(buttonTimerRef.current);
      }
    };
  }, []);
  
  // 当消息内容出现时，启动倒计时（仅执行一次）
  useEffect(() => {
    if (messageList[0]?.content && !hasCountdownStarted) {
      // 标记已开始倒计时
      setHasCountdownStarted(true);
      
      // 清除之前的定时器（如果存在）
      if (buttonTimerRef.current) {
        clearInterval(buttonTimerRef.current);
      }
      // 重置倒计时为5秒
      setCountdown(5);
      setIsStartButtonDisabled(true);
      
      // 设置倒计时定时器
      buttonTimerRef.current = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            // 倒计时结束，清除定时器并启用按钮
            clearInterval(buttonTimerRef.current);
            setIsStartButtonDisabled(false);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
  }, [messageList[0]?.content, hasCountdownStarted]);

  // 动态选项配置数组，支持多个按钮
  const optionConfigs = [
    {
      id: 'option1',
      icon: '⚡',
      badge: '高效模式',
      texts: [
        '最高效率完成！',
        '立即行动，高效处理！',
        '全力以赴，快速完成！',
        '加速前进，高效工作！',
        '集中精力，高效解决！'
      ]
    },
    {
      id: 'option2',
      icon: '🌿',
      badge: '舒适模式',
      texts: [
        '慢慢来，我不想太累',
        '轻松节奏，舒适完成',
        '稳扎稳打，享受过程',
        '按部就班，不急不躁',
        '劳逸结合，保持平衡'
      ]
    },
    {
      id: 'option3',
      icon: '🔄',
      badge: '循环模式',
      texts: [
        '分段高效，适当休息',
        '专注与放松相结合',
        '番茄工作法，科学安排',
        '张弛有度，持续高效',
        '工作休息，交替进行'
      ]
    },
    {
      id: 'option4',
      icon: '🎯',
      badge: '目标导向',
      texts: [
        '锁定重点，精准突破',
        '聚焦核心任务',
        '抓住关键，事半功倍',
        '明确目标，高效执行',
        '优先级排序，逐一完成'
      ]
    }
  ];

  // 随机选择按钮文字
  const getRandomText = (textArray) => {
    return textArray[Math.floor(Math.random() * textArray.length)];
  };

  // 随机获取2-4个选项按钮
  const getRandomOptions = (allOptions) => {
    // 随机选择2-4个选项
    const count = Math.floor(Math.random() * 3) + 2; // 2, 3 或 4
    // 创建数组副本并打乱顺序
    const shuffled = [...allOptions].sort(() => 0.5 - Math.random());
    // 返回前count个选项
    return shuffled.slice(0, count);
  };

  // 使用useState存储当前显示的选项和文字
  const [displayedOptions, setDisplayedOptions] = useState(getRandomOptions(optionConfigs));
  const [dynamicTexts, setDynamicTexts] = useState(() => {
    const initialTexts = {};
    displayedOptions.forEach(config => {
      initialTexts[config.id] = getRandomText(config.texts);
    });
    return initialTexts;
  });

  // 当进入选项页面时，随机选择2-4个按钮并生成新的随机文字
  useEffect(() => {
    if (step === 'options') {
      // 随机选择2-4个选项
      const newOptions = getRandomOptions(optionConfigs);
      setDisplayedOptions(newOptions);

      // 为选中的选项生成随机文字
      const newTexts = {};
      newOptions.forEach(config => {
        newTexts[config.id] = getRandomText(config.texts);
      });
      setDynamicTexts(newTexts);

      // 重置选中状态
      setSelectedOption('');
    }
  }, [step]);

  const handleTellButtonClick = () => {
    setStep('editor');
    // 延迟设置焦点，确保元素已渲染
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 100);
  };

  const handleConfirmButtonClick = () => {
    // 获取最终编辑的内容
    const content = editorRef.current ? editorRef.current.innerHTML : '';
    setFinalContent(content);
    // 保存最终内容到localStorage
    localStorage.setItem('finalContent', content);
    console.log('确认内容:', content);
    // 切换到选项页面
    setStep('selectedIdentity');
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleStartOrganizing = () => {
    console.log('选择的选项:', selectedOption);
    // 切换到身份选择页面
    setStep('selectedIdentity');
  };

  const handleIdentityConfirm = async () => {
    console.log('开始身份确认流程');
    // 重置消息列表
    setMessageList([]);
    // 清除之前可能被中止的控制器
    if (controllerRef.current) {
      controllerRef.current = null;
      console.log('已清除之前的控制器');
    }
    // 重置状态
    setStatus(0);
    
    // 确保创建新的会话
    try {
      // 先重置会话ID
      setConversationId(null);
      console.log('已重置会话ID');
      
      // 重新创建会话
      const result = await createConversation();
      console.log('创建会话结果:', result);
      
      // 使用新的Promise处理异步状态更新
      await new Promise(resolve => setTimeout(resolve, 100)); // 给React时间更新状态
      
      // 显示模态弹窗
      setShowModal(true);
      
      // 即使会话ID可能尚未更新，我们也调用streamChatApi
      // streamChatApi函数内部有会话ID检查
      console.log('准备调用streamChatApi');
      streamChatApi();
    } catch (error) {
      console.error('创建会话失败:', error);
    }
  };
  
  // 关闭模态弹窗
  const closeModal = () => {
    // 确定最终使用的身份信息
    const finalIdentity = identityInput.trim() ||
      (selectedIdentity === 0 ? '十八线小爱豆' :
        (selectedIdentity === 1 ? '职场小牛马' :
          (selectedIdentity === 2 ? '复仇黑莲花' : '')));

    console.log('Final selected identity:', finalIdentity);
    console.log('Selected identity index:', selectedIdentity);
    console.log('Identity input:', identityInput);

    // 保存身份信息到localStorage
    localStorage.setItem('userIdentity', finalIdentity);
    localStorage.setItem('selectedIdentity', selectedIdentity);
    localStorage.setItem('identityInput', identityInput);

    // 隐藏模态框并跳转到Home页面
    setShowModal(false);
    navigate('/Home');
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (buttonTimerRef.current) {
        clearTimeout(buttonTimerRef.current);
      }
    };
  }, []);

  // 当identityInput变化时，立即保存到localStorage
  useEffect(() => {
    localStorage.setItem('identityInput', identityInput);
    // 同时更新userIdentity，确保两处数据保持同步
    localStorage.setItem('userIdentity', identityInput);
  }, [identityInput]);

  // 当finalContent变化时，立即保存到localStorage
  useEffect(() => {
    localStorage.setItem('finalContent', finalContent);
  }, [finalContent]);

  // 当selectedIdentity变化时，更新对应的userIdentity到localStorage
  useEffect(() => {
    if (selectedIdentity !== null && !identityInput.trim()) {
      const identityMap = [
        { id: 0, name: '十八线小爱豆' },
        { id: 1, name: '职场小牛马' },
        { id: 2, name: '复仇黑莲花' }
      ];
      const selectedIdentityName = identityMap.find(item => item.id === selectedIdentity)?.name || '';
      localStorage.setItem('userIdentity', selectedIdentityName);
    }
  }, [selectedIdentity, identityInput]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
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
    try {
      controllerRef.current = new AbortController();
      
      // 确保conversationId存在
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
                ${identityInput.trim() || (selectedIdentity === 0 ? '十八线小爱豆' : (selectedIdentity === 1 ? '职场小牛马' : (selectedIdentity === 2 ? '复仇黑莲花' : '')))}
              # ToDo list
              ${finalContent}`,
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



  useEffect(() => {
    initCoze();
  }, []);

  // 初始化编辑器内容
  useEffect(() => {
    if (editorRef.current && !editorContent) {
      const initialContent = `
        <p>aaaaaaaa</p>
        <p>bbbbbbbb</p>
        <p>cccccc</p>
        <p>dddddddddd</p>
      `.trim();
      editorRef.current.innerHTML = initialContent;
      setEditorContent(initialContent);
    }
  }, [editorContent]);
  console.log('messageList',messageList);
  return (
    <div className="page about-page">
      {step === 'initial' && (
        <div className="about-container">
          <div className="about-decoration">
            <svg width="80" height="80" viewBox="0 0 100 100" className="about-icon">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#667eea" strokeWidth="2" strokeDasharray="10,10" />
              <path d="M30 50C30 33.43 43.43 20 60 20C76.57 20 90 33.43 90 50C90 66.57 76.57 80 60 80H30V50Z" fill="#f8fafc" />
              <circle cx="50" cy="45" r="8" fill="#667eea" />
              <path d="M40 65C45 72 55 72 60 65" stroke="#667eea" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <p className="about-text">今天学什么？</p>
          <p className="about-subtext">将冰冷的学习待办清单，而是一个为你量身定制故事的AI游戏化伙伴。</p>
          <button
            className="about-button"
            onClick={handleTellButtonClick}
            aria-label="开始记录"
          >
            告诉TA
            <svg width="20" height="20" viewBox="0 0 24 24" className="button-icon">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {step === 'editor' && (
        <div className="content-container">
          <button
            className="back-button"
            onClick={() => setStep('initial')}
            aria-label="返回上一步"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="editor-header">
            <h2 className="editor-title">记录你的想法</h2>
            <p className="editor-subtitle">将你的计划和任务写下来</p>
          </div>

          <div className="editor-toolbar">
            <button className="toolbar-btn" onClick={() => document.execCommand('bold', false, null)} title="加粗">
              <strong>B</strong>
            </button>
            <button className="toolbar-btn" onClick={() => document.execCommand('italic', false, null)} title="斜体">
              <em>I</em>
            </button>
            <button className="toolbar-btn" onClick={() => document.execCommand('underline', false, null)} title="下划线">
              <u>U</u>
            </button>
            <button className="toolbar-btn" onClick={() => document.execCommand('insertUnorderedList', false, null)} title="无序列表">
              <span>•</span> 列表
            </button>
            <button className="toolbar-btn" onClick={() => document.execCommand('insertOrderedList', false, null)} title="有序列表">
              <span>1.</span> 列表
            </button>
          </div>

          <div
            ref={editorRef}
            className="rich-text-editor"
            contentEditable
            suppressContentEditableWarning={true}
            onInput={handleEditorChange}
            placeholder="开始编辑内容..."
          />

          <div className="editor-footer">
            <div className="character-count">
              字符数: {editorContent.replace(/<[^>]*>/g, '').length}
            </div>
            <button
              className="confirm-button"
              onClick={handleConfirmButtonClick}
              disabled={!editorContent.replace(/<[^>]*>/g, '').trim()}
            >
              下一步
              <svg width="20" height="20" viewBox="0 0 24 24" className="button-icon">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}



      {step === 'selectedIdentity' && (
        <div className="identity-container">
          <button
            className="back-button"
            onClick={() => setStep('editor')}
            aria-label="返回上一步"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 className="identity-title">请选择你的今日身份</h2>
          <div className="identity-options">
            {[0, 1, 2].map((index) => (
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
                  </div>
                </div>
                <div className="identity-name" style={{ marginTop: '8px', textAlign: 'center', fontSize: '1rem' }}>
                  {index === 0 && '十八线小爱豆'}
                  {index === 1 && '职场小牛马'}
                  {index === 2 && '复仇黑莲花'}
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
            onClick={handleIdentityConfirm}
            disabled={selectedIdentity === null && !identityInput.trim()}
          >
            确认身份
          </button>
        </div>
      )}
      
      {/* 模态弹窗组件 */}
      {showModal && (
        <div className="modal-overlay identity-confirm-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">身份确认中</h3>
            </div>
            {!messageList[0]?.content&& (
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
                         { id: 2, name: '复仇黑莲花', emoji: '🖤' }
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
               <div style={{minHeight:'315px'}}> 
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
                onClick={closeModal}
                disabled={isStartButtonDisabled}
              >
                {!messageList[0]?.content ? '准备中' : (isStartButtonDisabled ? `${countdown}s...` : '开始学习')}
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