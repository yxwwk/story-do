 const  LockModal = ({  onClose }) =>  {
            const handleClose = () => {
                    console.log("LockModal")

                onClose();
            };
            return (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* 背景遮罩 */}
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={onClose}
                    ></div>
                    
                    {/* 弹窗内容 */}
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-10 flex flex-col items-center">
                        {/* 锁图标 */}
                        <div className="mb-4">
                            <img 
                                src="https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/14d1b4d5f81948fc9054108f99718b02~tplv-a9rns2rl98-image.image?rcl=202510242022575564BA989B563A6F18AE&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1763900597&x-signature=pqCktrY90qBSYyXkFZPGslNSV0E%3D" 
                                alt="锁定图标" 
                                className="w-16 h-16 mx-auto"
                            />
                        </div>
                        
                        {/* 提示文本 */}
                        <div className="text-center mb-6">
                            <p className="text-gray-700 text-lg font-medium">
                                此任务已锁定，请先完成前置任务
                            </p>
                        </div>
                        
                        {/* 确认按钮 */}
                        <button 
                            onClick={handleClose}
                            className="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            我知道了
                        </button>
                    </div>
                </div>
            );
        }

        export default LockModal;