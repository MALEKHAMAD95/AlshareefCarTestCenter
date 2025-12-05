const DashboardPage = () => {
    return (
        <main className="relative w-full max-w-[1100px] mx-auto flex justify-center slide-scale-container">
            <div
                id="slide-container"
                className="slide-wrapper bg-white rounded-xl overflow-hidden relative shadow-2xl shadow-black/50 flex"
            >
                <div className="w-1/3 bg-slate-900 relative overflow-hidden flex flex-col p-10 justify-between">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-600 rounded-full blur-3xl mix-blend-screen"></div>
                        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-600 rounded-full blur-3xl mix-blend-screen"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            <span className="text-xs font-medium text-slate-300 tracking-wider">
                                LIVE DATA
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                            الشاشة الرئيسية
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                                Performance
                            </span>
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
             مرحباً بك في نظام مركز الشريف لاختبار المركبات
                        </p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                                
                            </div>
                            <div className="text-sm text-slate-300">
                               صفحة التحليلات الرئيسية
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                                
                            </div>
                            <div className="text-sm text-slate-300">
                               صفحة الاحصائات الرئيسية
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-2/3 bg-slate-50 p-10 relative">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-slate-800 font-bold text-xl">
                                مرححباً بك مرة أخرى يا سلطان
                            </h3>
                            <p className="text-slate-500 text-sm">
                                {new Date().toLocaleString()}
                            </p>
                        </div>
                        <div className="flex -space-x-2">
                            <img
                                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md"
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&amp;fit=crop&amp;w=64&amp;h=64"
                                alt="User 1"
                            />
                            <img
                                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md"
                                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&amp;fit=crop&amp;w=64&amp;h=64"
                                alt="User 2"
                            />
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-md">
                                +5
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-5 rounded-xl complex-shadow border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
إدخال                                </p> 
                                <h4 className="text-3xl font-bold text-slate-800">
 مركبة                                </h4>
                                {/* <div className="mt-3 flex items-center text-xs font-semibold text-green-600">
                                    <svg
                                        className="w-3 h-3 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        ></path>
                                    </svg>
                                    <span>+14.5%</span>
                                </div> */}
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl complex-shadow border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
                                    اضافة
                                </p> 
                                <h4 className="text-3xl font-bold text-slate-800">
الإستقبال                                </h4>
                                <div className="mt-3 flex items-center text-xs font-semibold text-green-600">
                                    <svg
                                        className="w-3 h-3 mr-1"
                           
                                    >
                                        <path
                                 
                                        ></path>
                                    </svg>
                                    <span> </span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="p-5 rounded-xl shadow-lg text-white relative overflow-hidden"
                            style={{
                                background:
                                    'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
                            }}
                        >
                            <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">
                                فحص
                            </p>

                            <h4 className="text-3xl font-bold text-white">
                                كارسير
                            </h4>

                            <div className="mt-3 w-full bg-black/20 rounded-full h-1.5">
                                <div
                                    className="bg-white/90 h-1.5 rounded-full"
                                    style={{ width: '70%' }}
                                />
                            </div>
                        </div>
                        <div
                            className="p-5 rounded-xl shadow-lg text-white relative overflow-hidden"
                            style={{
                                background:
                                    'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
                            }}
                        >
                            <pس className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">
                              
تقرير 
                            </pس>

                            <h4 className="text-3xl font-bold text-white">
                               سابق
                            </h4>

                            <div className="mt-3 w-full bg-black/20 rounded-full h-1.5">
                                <div
                                    className="bg-white/90 h-1.5 rounded-full"
                                    style={{ width: '70%' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-100">
                        <h5 className="font-bold text-orange-900 mb-3">
                            Analysis Summary
                        </h5>
                        <p className="text-orange-800/80 text-sm leading-relaxed">
                            The{' '}
                            <span className="font-bold text-orange-600">
                                Q3 projection
                            </span>{' '}
                            exceeds expectations due to the new{' '}
                            <span className="italic">
                                optimization algorithm
                            </span>
                            . We observed a{' '}
                            <span className="bg-white px-1 py-0.5 rounded shadow-sm text-orange-700 font-medium border border-orange-100">
                                240% increase
                            </span>{' '}
                            in processing speed across all nodes.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DashboardPage
