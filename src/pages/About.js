import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/About.css';

const About = () => {
  const [step, setStep] = useState('initial'); // initial, editor, options, selectedIdentity
  const [editorContent, setEditorContent] = useState('');
  const editorRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedIdentity, setSelectedIdentity] = useState(null); // 默认未选中任何身份，确保按钮禁用状态正常工作
  const navigate = useNavigate();
  
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
    const finalContent = editorRef.current ? editorRef.current.innerHTML : '';
    console.log('确认内容:', finalContent);
    // 切换到选项页面
    setStep('options');
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleStartOrganizing = () => {
    console.log('选择的选项:', selectedOption);
    // 切换到身份选择页面
    setStep('selectedIdentity');
  };

  const handleIdentityConfirm = () => {
    console.log('Selected identity:', selectedIdentity);
    // 跳转到Home页面
    navigate('/Home');
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
    }
  };

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
          <p className="about-text">今天的你准备做些什么呢？</p>
          <p className="about-subtext">记录你的想法，整理你的一天</p>
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
      
      {step === 'options' && (
        <div className="options-container">
          <button 
            className="back-button"
            onClick={() => setStep('editor')}
            aria-label="返回上一步"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="options-text">看起来是忙碌的一天呢，告诉我你想怎么开始！</p>
          {/* 动态渲染2-4个选项按钮 */}
          {displayedOptions.map((config, index) => (
            <div 
              key={config.id}
              className={`option-item option-${index + 1} ${selectedOption === config.id ? 'selected' : ''}`}
              onClick={() => handleOptionClick(config.id)}
            >
              <span className="option-icon">{config.icon}</span>
              {dynamicTexts[config.id]}
              <span className="option-badge">{config.badge}</span>
            </div>
          ))}
          <button className="organize-button" onClick={handleStartOrganizing}>开始整理</button>
        </div>
      )}

      {step === 'selectedIdentity' && (
        <div className="identity-container">
          <button 
            className="back-button"
            onClick={() => setStep('options')}
            aria-label="返回上一步"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 className="identity-title">整理完毕！请选择你的今日身份</h2>
          <div className="identity-options">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`identity-item ${selectedIdentity === index ? 'selected' : ''}`}
                onClick={() => setSelectedIdentity(index)}
              >
                <div className="identity-image">
                  {/* 使用emoji作为身份图标 */}
                  <span style={{ fontSize: '3rem' }}>
                    {index === 0 && '👨‍💼'}
                    {index === 1 && '🎨'}
                    {index === 2 && '🧠'}
                  </span>
                </div>
                <div className="identity-name">
                  {index === 0 && '职场达人'}
                  {index === 1 && '创意设计师'}
                  {index === 2 && '思考者'}
                </div>
                {selectedIdentity === index && (
                  <div className="identity-checkmark">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
          <button 
            className="identity-confirm-button"
            onClick={handleIdentityConfirm}
            disabled={selectedIdentity === null}
          >
            确认选择
            <svg width="20" height="20" viewBox="0 0 24 24" className="button-icon">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default About;