(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/Agent Team/components/PreviewView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PreviewView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Agent Team/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Agent Team/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/Desktop/Agent Team/node_modules/react-markdown/lib/index.js [app-client] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$store$2f$useStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Agent Team/store/useStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// Parse blog frontmatter
function parseBlogFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return {
        meta: {},
        body: content
    };
    const meta = {};
    match[1].split('\n').forEach((line)=>{
        const [key, ...vals] = line.split(':');
        if (key && vals.length) {
            meta[key.trim()] = vals.join(':').trim().replace(/^["']|["']$/g, '');
        }
    });
    return {
        meta,
        body: match[2]
    };
}
// Get settings from localStorage
function getSettings() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const stored = localStorage.getItem('smm-agent-settings');
    if (!stored) return {};
    try {
        return JSON.parse(stored);
    } catch  {
        return {};
    }
}
const TABS = [
    {
        id: 'blog',
        label: 'Blog'
    },
    {
        id: 'x',
        label: 'X'
    },
    {
        id: 'linkedin',
        label: 'LinkedIn'
    },
    {
        id: 'image',
        label: 'Image'
    }
];
function PreviewView() {
    _s();
    const { topic, results, previewTab, setPreviewTab, reset, showMarkdown, toggleMarkdown } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$store$2f$useStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])();
    const [isPublishing, setIsPublishing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [publishResult, setPublishResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const blogContent = results?.blog || '';
    const xContent = results?.x || '';
    const linkedinContent = results?.linkedin || '';
    const imageUrl = results?.image || '';
    const handlePublish = async (platform)=>{
        let content;
        if (platform === 'x') content = xContent;
        else if (platform === 'linkedin') content = linkedinContent;
        else if (platform === 'blog') content = blogContent;
        if (!content) return;
        const settings = getSettings();
        setIsPublishing(true);
        setPublishResult(null);
        try {
            let response;
            if (platform === 'blog') {
                response = await fetch('/api/publish-blog', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        blogContent: content,
                        blogApiKey: settings.blogApiKey,
                        blogApiUrl: settings.blogApiUrl
                    })
                });
            } else {
                response = await fetch('/api/publish', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        [platform === 'x' ? 'xContent' : 'linkedinContent']: content,
                        imageUrl,
                        schedule: 'next-free-slot',
                        typefullyApiKey: settings.typefullyApiKey,
                        typefullySocialSetId: settings.typefullySocialSetId
                    })
                });
            }
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to publish');
            }
            setPublishResult({
                success: true,
                message: 'Published successfully!'
            });
        } catch (error) {
            setPublishResult({
                success: false,
                message: error.message
            });
        } finally{
            setIsPublishing(false);
        }
    };
    const { meta: blogMeta, body: blogBody } = parseBlogFrontmatter(blogContent);
    const renderTabContent = ()=>{
        switch(previewTab){
            case 'blog':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleMarkdown,
                                className: "text-sm text-slate-400 hover:text-white",
                                children: showMarkdown ? 'View Rendered' : 'View Markdown'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                lineNumber: 116,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 115,
                            columnNumber: 13
                        }, this),
                        showMarkdown ? /* Raw Markdown View */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-slate-800 rounded-lg p-4 overflow-auto max-h-[400px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "text-sm text-slate-300 whitespace-pre-wrap font-mono",
                                children: blogContent || 'No blog content'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                lineNumber: 127,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 126,
                            columnNumber: 15
                        }, this) : /* Rendered Blog Preview */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-lg p-6 overflow-auto max-h-[400px]",
                            children: [
                                blogMeta.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6 pb-4 border-b border-gray-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-2xl font-bold text-gray-900",
                                            children: blogMeta.title
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                            lineNumber: 136,
                                            columnNumber: 21
                                        }, this),
                                        blogMeta.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-600 mt-2",
                                            children: blogMeta.description
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                            lineNumber: 138,
                                            columnNumber: 23
                                        }, this),
                                        blogMeta.date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500 mt-2",
                                            children: blogMeta.date
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                            lineNumber: 141,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                    lineNumber: 135,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "prose prose-sm max-w-none text-gray-800",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                        children: blogBody || 'No blog content'
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                        lineNumber: 146,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                    lineNumber: 145,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 133,
                            columnNumber: 15
                        }, this),
                        blogContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handlePublish('blog'),
                                disabled: isPublishing,
                                className: "px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded text-white text-sm font-medium",
                                children: isPublishing ? 'Publishing...' : 'Publish to Blog'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                lineNumber: 153,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 152,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                    lineNumber: 113,
                    columnNumber: 11
                }, this);
            case 'x':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleMarkdown,
                                className: "text-sm text-slate-400 hover:text-white",
                                children: showMarkdown ? 'View Rendered' : 'View Markdown'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 169,
                            columnNumber: 13
                        }, this),
                        showMarkdown ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-slate-800 rounded-lg p-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "text-sm text-slate-300 whitespace-pre-wrap font-mono",
                                children: xContent || 'No X content'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                lineNumber: 180,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 179,
                            columnNumber: 15
                        }, this) : /* X/Twitter Preview */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-black rounded-xl p-4 max-w-md mx-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm",
                                        children: "U"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                        lineNumber: 188,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-white text-sm",
                                                        children: "Your Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-500 text-sm",
                                                        children: "@yourhandle"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                                        lineNumber: 194,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                                lineNumber: 192,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 text-white text-sm whitespace-pre-wrap",
                                                children: xContent || 'No X content'
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                                lineNumber: 196,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                        lineNumber: 191,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                lineNumber: 187,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 186,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `text-sm ${(xContent?.length || 0) > 280 ? 'text-red-400' : 'text-green-400'}`,
                                    children: [
                                        xContent?.length || 0,
                                        " / 280"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                    lineNumber: 205,
                                    columnNumber: 15
                                }, this),
                                xContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handlePublish('x'),
                                    disabled: isPublishing,
                                    className: "px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded text-white text-sm font-medium",
                                    children: isPublishing ? 'Publishing...' : 'Publish to X'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                    lineNumber: 212,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 204,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                    lineNumber: 167,
                    columnNumber: 11
                }, this);
            case 'linkedin':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleMarkdown,
                                className: "text-sm text-slate-400 hover:text-white",
                                children: showMarkdown ? 'View Rendered' : 'View Markdown'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                lineNumber: 229,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 228,
                            columnNumber: 13
                        }, this),
                        showMarkdown ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-slate-800 rounded-lg p-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "text-sm text-slate-300 whitespace-pre-wrap font-mono",
                                children: linkedinContent || 'No LinkedIn content'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                lineNumber: 239,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 238,
                            columnNumber: 15
                        }, this) : /* LinkedIn Preview */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-lg p-4 max-w-lg mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold",
                                            children: "U"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                            lineNumber: 247,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-gray-900",
                                                    children: "Your Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                                    lineNumber: 251,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500",
                                                    children: "Your Title • Just now"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                                    lineNumber: 252,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                            lineNumber: 250,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                    lineNumber: 246,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-800 text-sm whitespace-pre-wrap",
                                    children: linkedinContent || 'No LinkedIn content'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                    lineNumber: 255,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 245,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `text-sm ${(linkedinContent?.length || 0) > 3000 ? 'text-red-400' : 'text-green-400'}`,
                                    children: [
                                        linkedinContent?.length || 0,
                                        " / 3000"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                    lineNumber: 262,
                                    columnNumber: 15
                                }, this),
                                linkedinContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handlePublish('linkedin'),
                                    disabled: isPublishing,
                                    className: "px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded text-white text-sm font-medium",
                                    children: isPublishing ? 'Publishing...' : 'Publish to LinkedIn'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                    lineNumber: 269,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 261,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                    lineNumber: 226,
                    columnNumber: 11
                }, this);
            case 'image':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center",
                    children: [
                        imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: imageUrl,
                            alt: "Generated",
                            className: "max-w-full max-h-[350px] rounded-lg",
                            onError: (e)=>{
                                // Fallback to placeholder on error
                                e.target.src = `https://placehold.co/1200x630/1e293b/64748b?text=${encodeURIComponent(topic || 'Image')}`;
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 285,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full h-48 bg-slate-800 rounded-lg flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-500",
                                children: "No image"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                                lineNumber: 296,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 295,
                            columnNumber: 15
                        }, this),
                        imageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: imageUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "mt-4 text-sm text-blue-400 hover:underline",
                            children: "Open image in new tab"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                            lineNumber: 300,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                    lineNumber: 283,
                    columnNumber: 11
                }, this);
            default:
                return null;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-3xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 p-3 bg-green-900/30 border border-green-800/50 rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-green-300 text-sm",
                    children: [
                        'Content generated for "',
                        topic,
                        '"'
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                    lineNumber: 321,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                lineNumber: 320,
                columnNumber: 7
            }, this),
            publishResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `mb-4 p-3 rounded-lg ${publishResult.success ? 'bg-green-900/30 border border-green-800/50' : 'bg-red-900/30 border border-red-800/50'}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `text-sm ${publishResult.success ? 'text-green-300' : 'text-red-300'}`,
                    children: publishResult.success ? publishResult.message : `Error: ${publishResult.message}`
                }, void 0, false, {
                    fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                    lineNumber: 332,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                lineNumber: 326,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-1 bg-slate-900 p-1 rounded-lg mb-4",
                children: TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setPreviewTab(tab.id),
                        className: `flex-1 py-2 px-4 rounded text-sm font-medium ${previewTab === tab.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`,
                        children: tab.label
                    }, tab.id, false, {
                        fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                        lineNumber: 341,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                lineNumber: 339,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-900 border border-slate-800 rounded-lg p-4 mb-4",
                children: renderTabContent()
            }, void 0, false, {
                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                lineNumber: 355,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: reset,
                className: "w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium",
                children: "Create New"
            }, void 0, false, {
                fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
                lineNumber: 360,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Agent Team/components/PreviewView.tsx",
        lineNumber: 318,
        columnNumber: 5
    }, this);
}
_s(PreviewView, "bPFBWg1LbClNw4MeNf2n+ioTS94=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Agent__Team$2f$store$2f$useStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
_c = PreviewView;
var _c;
__turbopack_context__.k.register(_c, "PreviewView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Agent Team/components/PreviewView.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/Agent Team/components/PreviewView.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=Desktop_Agent%20Team_components_PreviewView_tsx_c0c7acb6._.js.map