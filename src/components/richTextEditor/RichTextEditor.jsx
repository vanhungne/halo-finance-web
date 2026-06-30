import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import { ImageUpload } from '../../extensions/ImageUpload';

import {
    TextAlignStart,
    TextAlignCenter,
    TextAlignEnd,
    TextAlignJustify,
    ImageIcon,
    Redo2,
    Undo2,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    ChevronDown,
    List,
    ListOrdered,
    ListTodo,
    Quote,
} from 'lucide-react';

const RichTextEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                image: false,
                bulletList: false,
                orderedList: false,
            }),
            BulletList,
            OrderedList,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            ImageUpload,
            Placeholder.configure({
                placeholder: 'Bạn muốn chia sẻ điều gì?',
            }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            const html = editor.getHTML();
            onChange?.({ html, json });
        },
        editorProps: {
            attributes: {
                class:
                    'prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[300px] border border-gray-300 rounded-md p-4',
            },
        },
    });

    const [openHeading, setOpenHeading] = useState(false);
    const [openList, setOpenList] = useState(false);

    if (!editor) return null;

    const headings = [
        { label: 'Heading 1', icon: <Heading1 className="w-4 h-4" />, level: 1 },
        { label: 'Heading 2', icon: <Heading2 className="w-4 h-4" />, level: 2 },
        { label: 'Heading 3', icon: <Heading3 className="w-4 h-4" />, level: 3 },
        { label: 'Heading 4', icon: <Heading4 className="w-4 h-4" />, level: 4 },
    ];

    const currentHeading =
        headings.find((h) => editor.isActive('heading', { level: h.level }))?.icon || (
            <Heading className="w-4 h-4" />
        );

    const lists = [
        { label: 'Bullet List', icon: <List className="w-4 h-4" />, action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList') },
        { label: 'Numbered List', icon: <ListOrdered className="w-4 h-4" />, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList') },
        { label: 'Task List', icon: <ListTodo className="w-4 h-4" />, action: () => editor.chain().focus().toggleTaskList().run(), isActive: editor.isActive('taskList') },
    ];
    useEffect(() => {
        if (!editor || !value) return;
        const content = value.json || value;
        if (editor.isEmpty) {
            editor.commands.setContent(content);
        }
    }, [editor]);
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 mb-2 p-2 border border-gray-300 rounded-t-md bg-gray-50">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Undo"
                    type="button"
                >
                    <Undo2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Redo"
                    type="button"
                >
                    <Redo2 className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Heading dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setOpenHeading(!openHeading);
                            setOpenList(false);
                        }}
                        className="flex items-center gap-1 px-2 py-2 rounded hover:bg-gray-200"
                        title="Tiêu đề"
                        type="button"
                    >
                        {currentHeading}
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    {openHeading && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenHeading(false)}
                            ></div>
                            <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-300 rounded shadow-lg z-20">
                                <button
                                    onClick={() => {
                                        editor.chain().focus().setParagraph().run();
                                        setOpenHeading(false);
                                    }}
                                    className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${!editor.isActive('heading') && editor.isActive('paragraph') ? 'bg-blue-50 text-blue-700' : ''
                                        }`}
                                    type="button"
                                >
                                    <span className="font-normal">Paragraph</span>
                                </button>
                                {headings.map((h) => (
                                    <button
                                        key={h.level}
                                        onClick={() => {
                                            editor.chain().focus().toggleHeading({ level: h.level }).run();
                                            setOpenHeading(false);
                                        }}
                                        className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${editor.isActive('heading', { level: h.level }) ? 'bg-blue-50 text-blue-700' : ''
                                            }`}
                                        type="button"
                                    >
                                        {h.icon}
                                        <span>{h.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* List dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setOpenList(!openList);
                            setOpenHeading(false);
                        }}
                        className="flex items-center gap-1 px-2 py-2 rounded hover:bg-gray-200"
                        title="Danh sách"
                        type="button"
                    >
                        <List className="w-4 h-4" />
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    {openList && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenList(false)}
                            ></div>
                            <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-300 rounded shadow-lg z-20">
                                {lists.map((l, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            l.action();
                                            setOpenList(false);
                                        }}
                                        className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${l.isActive ? 'bg-blue-50 text-blue-700' : ''
                                            }`}
                                        type="button"
                                    >
                                        {l.icon}
                                        <span>{l.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
                    title="Trích dẫn"
                    type="button"
                >
                    <Quote className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Text style */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
                    title="In đậm"
                    type="button"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
                    title="In nghiêng"
                    type="button"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
                    title="Gạch chân"
                    type="button"
                >
                    <Underline className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-300' : ''}`}
                    title="Gạch ngang"
                    type="button"
                >
                    <Strikethrough className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Alignment */}
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
                    title="Căn trái"
                    type="button"
                >
                    <TextAlignStart className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
                    title="Căn giữa"
                    type="button"
                >
                    <TextAlignCenter className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
                    title="Căn phải"
                    type="button"
                >
                    <TextAlignEnd className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300' : ''}`}
                    title="Căn đều"
                    type="button"
                >
                    <TextAlignJustify className="w-4 h-4" />
                </button>
                <button
                    onClick={() => {
                        editor.chain().focus().insertContent({ type: 'imageUpload', attrs: { src: '', alt: '' } }).run();
                    }}
                    className="px-2 py-1 rounded hover:bg-gray-100"
                    title="Chèn ảnh"
                    type="button"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Editor */}
            <div className="border border-t-0 border-gray-300 rounded-b-md">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

export default RichTextEditor;
