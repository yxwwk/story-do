import React from 'react'

const PageIndex = () => {
  return (
    <div className='bg-gradient-to-br from-light to-indigo-50 min-h-screen font-sans text-dark'>
          <header id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <nav class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between bg-white/80 bg-blur shadow-sm rounded-b-lg">
            <div class="flex items-center space-x-2">
                <i class="fa fa-magic text-primary text-2xl"></i>
                <span class="text-xl font-bold text-primary">TaskStoryAI</span>
            </div>
            <div class="hidden md:flex items-center space-x-8">
      
                <a href="/about" class="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105 shadow-md">立即体验</a>
            </div>
            <button class="md:hidden text-gray-700 focus:outline-none" id="mobile-menu-button">
                <i class="fa fa-bars text-xl"></i>
            </button>
        </nav>
        <div id="mobile-menu" class="md:hidden hidden bg-white/95 bg-blur shadow-lg absolute w-full">
            <div class="container mx-auto px-4 py-3 flex flex-col space-y-3">
                <a href="#features" class="py-2 px-4 font-medium text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors">功能特点</a>
                <a href="#how-it-works" class="py-2 px-4 font-medium text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors">工作原理</a>
                <a href="#use-cases" class="py-2 px-4 font-medium text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors">使用场景</a>
                <a href="#testimonials" class="py-2 px-4 font-medium text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors">用户评价</a>
                <a href="#call-to-action" class="py-2 px-4 bg-primary text-white rounded-lg font-medium text-center transition-all transform hover:scale-105">立即体验</a>
            </div>
        </div>
    </header>
         

           <section class="pt-32 pb-20 md:pt-40 md:pb-28">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center justify-between gap-12">
                <div class="w-full md:w-1/2 space-y-6">
                    <h1 class="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-tight text-left ">
                        <span class="bg-gradient-to-r from-primary to-secondary text-gradient">来试试吧！</span>
                        <br />
                        最好玩的待办管理器
                    </h1>
                    <p class="text-lg md:text-xl text-gray-600 max-w-lg text-left">
                        不再枯燥的待办事项！TaskStoryAI 根据你的任务列表，智能生成富有故事背景和情感连接的任务描述，让你的每一天都充满意义和动力。
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 pt-4">
                        <a href="/about" class="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-center transition-all transform hover:scale-105 shadow-lg">
                            免费使用 <i class="fa fa-arrow-right ml-2"></i>
                        </a>
                      
                    </div>
                    <div class="flex items-center pt-6 space-x-4">
                        <div class="flex -space-x-2">
                            <img src="https://picsum.photos/id/1001/100/100" alt="用户头像" class="w-10 h-10 rounded-full border-2 border-white" />
                            <img src="https://picsum.photos/id/1002/100/100" alt="用户头像" class="w-10 h-10 rounded-full border-2 border-white" />
                            <img src="https://picsum.photos/id/1003/100/100" alt="用户头像" class="w-10 h-10 rounded-full border-2 border-white" />
                            <img src="https://picsum.photos/id/1004/100/100" alt="用户头像" class="w-10 h-10 rounded-full border-2 border-white" />
                            <div class="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-primary font-medium text-xs">
                                1k+
                            </div>
                        </div>
                        <div>
                            <div class="flex items-center text-yellow-500">
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star"></i>
                                <i class="fa fa-star-half-o"></i>
                                <span class="ml-2 text-gray-600 font-medium">4.8/5</span>
                            </div>
                            <p class="text-sm text-gray-500">来自 1,000+ 满意用户</p>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/2 relative">
                    <div class="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl filter blur-3xl opacity-70 animate-pulse-slow"></div>
                    <div class="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100 animate-float">
                        <div class="p-6 bg-gradient-to-r from-primary to-secondary text-white">
                            <div class="flex justify-between items-center mb-4">
                                <div class="flex space-x-1">
                                    <span class="w-3 h-3 bg-red-400 rounded-full"></span>
                                    <span class="w-3 h-3 bg-yellow-400 rounded-full"></span>
                                    <span class="w-3 h-3 bg-green-400 rounded-full"></span>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <img src="https://picsum.photos/id/1005/100/100" alt="用户头像" class="w-10 h-10 rounded-full" />
                                <div>
                                    <p class="text-sm opacity-90 text-left">你好，高小吉</p>
                                    <p class="text-xs opacity-80">冒险任务已准备就绪</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-6 space-y-6">
                            <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 group hover:shadow-xl transition-all duration-300">
                                <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                                <div class="p-5 relative z-10">
                                    <div class="flex items-start justify-between mb-3">
                                        <div class="flex items-center space-x-2">
                                            <span class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                                <i class="fa fa-book"></i>
                                            </span>
                                            <h4 class="font-bold text-gray-800">学习三小时</h4>
                                        </div>
                                        <span class="bg-blue-500/20 text-blue-500 text-xs px-2.5 py-1 rounded-full font-medium">知识探索</span>
                                    </div>
                                    <div class="space-y-3">
                                        <p class="text-sm text-gray-600 leading-relaxed">
                                            <span class="font-semibold text-blue-500">故事情节：</span>作为一名年轻的魔法师学徒，你发现了一本古老的咒语书，上面记载着被遗忘的编程魔法。为了解开其中的秘密，你需要掌握这些神秘的咒语符号，并学会用它们创造奇妙的魔法效果。
                                        </p>
                                        <div class="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600">
                                            <span class="font-semibold text-gray-700">任务关联：</span> 完成Python基础课程第三章，编写3个简单程序，观看2个教学视频
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 group hover:shadow-xl transition-all duration-300">
                                <div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                                <div class="p-5 relative z-10">
                                    <div class="flex items-start justify-between mb-3">
                                        <div class="flex items-center space-x-2">
                                            <span class="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                                                <i class="fa fa-briefcase"></i>
                                            </span>
                                            <h4 class="font-bold text-gray-800">项目工作汇报</h4>
                                        </div>
                                        <span class="bg-amber-500/20 text-amber-500 text-xs px-2.5 py-1 rounded-full font-medium">职场挑战</span>
                                    </div>
                                    <div class="space-y-3">
                                        <p class="text-sm text-gray-600 leading-relaxed">
                                            <span class="font-semibold text-amber-500">故事情节：</span>作为王国的项目指挥官，你负责领导一项重要的城堡扩建工程。现在需要向国王汇报项目的最新进展、遇到的挑战和解决方案，以及下一步的实施计划。你的汇报将影响国王对项目的支持和资源分配。
                                        </p>
                                        <div class="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600">
                                            <span class="font-semibold text-gray-700">任务关联：</span> 收集项目各阶段进度数据，整理已完成的里程碑，分析当前遇到的问题，准备项目汇报PPT，与团队成员确认细节
                                        </div>
                                    </div>
                                </div>
                            </div>

                           

                            <button class="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                                <i class="fa fa-magic mr-2"></i>生成更多故事任务
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

      <section id="features" class="py-20 bg-white">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-16">
                <span class="inline-block px-3 py-1 text-xs font-semibold bg-indigo-100 text-primary rounded-full mb-4">核心功能</span>
                <h2 class="text-[clamp(2rem,4vw,3rem)] font-bold mb-6">让任务不再枯燥<br/><div style={{marginTop: '10px'}}>让剧情激发动力</div></h2>
                <p class="text-lg text-gray-600">TaskStoryAI 通过先进的人工智能技术，为你的每一个任务注入独特的故事背景和情感元素，让你在完成任务的过程中充满乐趣和动力。</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div class="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary text-2xl">
                        <i class="fa fa-magic"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3">AI智能故事生成</h3>
                    <p class="text-gray-600">根据任务类型、重要程度和个人偏好，智能生成个性化的故事背景，让每个任务都有独特的意义。</p>
                </div>
                <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div class="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary text-2xl">
                        <i class="fa fa-sliders"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3">高度自定义选项</h3>
                    <p class="text-gray-600">调整故事风格、长度和情感倾向，打造完全符合你个人喜好的任务描述，让每一次查看都充满惊喜。</p>
                </div>
                <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div class="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-6 text-accent text-2xl">
                        <i class="fa fa-heart"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3">情感连接增强</h3>
                    <p class="text-gray-600">通过故事化的任务描述，增强你与任务之间的情感连接，提高完成任务的内在动力和满足感。</p>
                </div>
                <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div class="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary text-2xl">
                        <i class="fa fa-clock-o"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3">智能时间管理</h3>
                    <p class="text-gray-600">根据任务优先级和截止时间，生成具有时间紧迫感的故事描述，帮助你更高效地管理时间。</p>
                </div>
                <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div class="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary text-2xl">
                        <i class="fa fa-refresh"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3">多样化故事变体</h3>
                    <p class="text-gray-600">为同一任务生成多种不同风格的故事描述，让你可以选择最能激发你动力的版本。</p>
                </div>
                <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
                    <div class="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-6 text-accent text-2xl">
                        <i class="fa fa-share-alt"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3">任务分享功能</h3>
                    <p class="text-gray-600">将你的故事化任务分享给朋友或团队，增加互动性和趣味性，让大家一起感受完成任务的乐趣。</p>
                </div>
            </div>
        </div>
    </section>


<section id="how-it-works" class="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-16">
                <span class="inline-block px-3 py-1 text-xs font-semibold bg-indigo-100 text-primary rounded-full mb-4">简单三步</span>
                <h2 class="text-[clamp(2rem,4vw,3rem)] font-bold mb-6">轻松创建<br /><div style={{marginTop: '10px'}}>带故事的任务列表</div></h2>
                <p class="text-lg text-gray-600">无需复杂的设置，只需简单几步，就能让你的任务列表焕然一新，充满故事和动力。</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div class="relative">
                    <div class="absolute -top-10 -left-10 w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-3xl">1</div>
                    <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 min-h-[300px] pt-10">
                        <div class="text-center mb-6">
                            <i class="fa fa-list-ul text-4xl text-primary"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 text-center">创建任务列表</h3>
                        <p class="text-gray-600">输入你的日常任务，添加基本信息如截止时间、优先级和任务类型，建立你的任务基础框架。</p>
                    </div>
                </div>
                <div class="relative">
                    <div class="absolute -top-10 -left-10 w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold text-3xl">2</div>
                    <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 min-h-[300px] pt-10">
                        <div class="text-center mb-6">
                            <i class="fa fa-sliders text-4xl text-secondary"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 text-center">选择故事风格</h3>
                        <p class="text-gray-600">选择你喜欢的故事风格、情感基调以及故事长度，让AI更好地理解你的偏好，生成符合你口味的故事。</p>
                    </div>
                </div>
                <div class="relative">
                    <div class="absolute -top-10 -left-10 w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-3xl">3</div>
                    <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-100 min-h-[300px] pt-10">
                        <div class="text-center mb-6">
                            <i class="fa fa-magic text-4xl text-accent"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 text-center">生成故事任务</h3>
                        <p class="text-gray-600">点击生成按钮，AI将为你的每个任务创建独特的故事背景。你可以查看、编辑或重新生成，直到满意为止。</p>
                    </div>
                </div>
            </div>
        </div>
    </section>



 <section id="use-cases" class="py-20 bg-white">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-16">
                <span class="inline-block px-3 py-1 text-xs font-semibold bg-indigo-100 text-primary rounded-full mb-4">适用场景</span>
                <h2 class="text-[clamp(2rem,4vw,3rem)] font-bold mb-6">为各种场景<br /><div style={{marginTop: '10px'}}>带来全新体验</div> </h2>
                <p class="text-lg text-gray-600">无论你是学生、职场人士还是家庭主妇，TaskStoryAI 都能为你的日常任务增添乐趣和动力。</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row">
                    <div class="md:w-2/5">
                        <img src="https://picsum.photos/id/180/600/800" alt="学生学习场景" class="w-full h-full object-cover" />
                    </div>
                    <div class="md:w-3/5 p-8">
                        <h3 class="text-xl font-bold mb-4">学生学习</h3>
                        <p class="text-gray-600 mb-4 text-left">将枯燥的学习任务转化为有趣的冒险故事，让复习、做作业和预习变得更加生动有趣，提高学习积极性和效率。</p>
                        <ul class="space-y-2">
                            <li class="flex items-start">
                                <i class="fa fa-check-circle text-accent mt-1 mr-2"></i>
                                <span class="text-gray-600">将知识点转化为探索任务</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fa fa-check-circle text-accent mt-1 mr-2"></i>
                                <span class="text-gray-600">让复习变成寻宝游戏</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fa fa-check-circle text-accent mt-1 mr-2"></i>
                                <span class="text-gray-600">提高学习动力和记忆效果</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row">
                    <div class="md:w-2/5">
                        <img src="https://picsum.photos/id/3/600/800" alt="职场工作场景" class="w-full h-full object-cover" />
                    </div>
                    <div class="md:w-3/5 p-8">
                        <h3 class="text-xl font-bold mb-4">职场工作</h3>
                        <p class="text-gray-600 mb-4 text-left">将日常工作任务转化为具有使命感的挑战，让项目推进、会议准备和报告撰写变得更加有意义和动力十足。</p>
                        <ul class="space-y-2">
                            <li class="flex items-start">
                                <i class="fa fa-check-circle text-accent mt-1 mr-2"></i>
                                <span class="text-gray-600">让项目任务变成英雄之旅</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fa fa-check-circle text-accent mt-1 mr-2"></i>
                                <span class="text-gray-600">增强团队协作的故事性</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fa fa-check-circle text-accent mt-1 mr-2"></i>
                                <span class="text-gray-600">提高工作效率和创新能力</span>
                            </li>
                        </ul>
                    </div>
                </div>
             
            </div>
        </div>
    </section>




      <section id="call-to-action" class="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-[clamp(2.5rem,5vw,4rem)] font-bold mb-6">准备好让你的任务列表<br /><div style={{marginTop: '10px'}}>焕然一新了吗？</div></h2>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              
            </div>
            <div class="mt-10 flex justify-center items-center space-x-4">
                <div class="flex -space-x-2">
                    <img src="https://picsum.photos/id/1001/100/100" alt="用户头像" class="w-10 h-10 rounded-full border-2 border-white" />
                    <img src="https://picsum.photos/id/1002/100/100" alt="用户头像" class="w-10 h-10 rounded-full border-2 border-white" />
                    <img src="https://picsum.photos/id/1003/100/100" alt="用户头像" class="w-10 h-10 rounded-full border-2 border-white" />
                    <img src="https://picsum.photos/id/1004/100/100" alt="用户头像" class="w-10 h-10 rounded-full border-2 border-white" />
                    <div class="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-white font-medium text-xs">
                        1k+
                    </div>
                </div>
                <p class="text-sm text-white/90">加入 1,000+ 已经爱上TaskStoryAI的用户</p>
            </div>
        </div>
    </section>


      <footer class="bg-dark text-white py-12">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
                <div>
                    <div class="flex items-center space-x-2 mb-6">
                        <i class="fa fa-magic text-primary text-2xl"></i>
                        <span class="text-xl font-bold">TaskStoryAI</span>
                    </div>
                    <p class="text-gray-400 mb-6">让你的任务列表充满生动故事和无限动力。</p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-primary transition-colors"><i class="fa fa-weixin text-xl"></i></a>
                        <a href="#" class="text-gray-400 hover:text-primary transition-colors"><i class="fa fa-weibo text-xl"></i></a>
                        <a href="#" class="text-gray-400 hover:text-primary transition-colors"><i class="fa fa-github text-xl"></i></a>
                        <a href="#" class="text-gray-400 hover:text-primary transition-colors"><i class="fa fa-linkedin text-xl"></i></a>
                    </div>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-6">产品</h4>
                    <ul class="space-y-3">
                        <li><a href="#features" class="text-gray-400 hover:text-white transition-colors">功能特点</a></li>
                        <li><a href="#how-it-works" class="text-gray-400 hover:text-white transition-colors">工作原理</a></li>
                        <li><a href="#use-cases" class="text-gray-400 hover:text-white transition-colors">使用场景</a></li>
                        <li><a href="#pricing" class="text-gray-400 hover:text-white transition-colors">价格</a></li>
                        <li><a href="#updates" class="text-gray-400 hover:text-white transition-colors">更新日志</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-6">支持</h4>
                    <ul class="space-y-3">
                        <li><a href="#faq" class="text-gray-400 hover:text-white transition-colors">常见问题</a></li>
                        <li><a href="#tutorials" class="text-gray-400 hover:text-white transition-colors">使用教程</a></li>
                        <li><a href="#contact" class="text-gray-400 hover:text-white transition-colors">联系我们</a></li>
                        <li><a href="#feedback" class="text-gray-400 hover:text-white transition-colors">反馈建议</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-6">公司</h4>
                    <ul class="space-y-3">
                        <li><a href="#about" class="text-gray-400 hover:text-white transition-colors">关于我们</a></li>
                        <li><a href="#blog" class="text-gray-400 hover:text-white transition-colors">博客</a></li>
                        <li><a href="#careers" class="text-gray-400 hover:text-white transition-colors">招贤纳士</a></li>
                        <li><a href="#privacy" class="text-gray-400 hover:text-white transition-colors">隐私政策</a></li>
                        <li><a href="#terms" class="text-gray-400 hover:text-white transition-colors">服务条款</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                <p>&copy; 2023 TaskStoryAI. 保留所有权利。</p>
            </div>
        </div>
    </footer>

    </div>
  )
}

export default PageIndex