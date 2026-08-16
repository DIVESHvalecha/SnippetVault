import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';

const EditorWrapper = ({ code, language, onChange, readOnly = false }) => {
    const handleEditorChange = (value) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#1e1e1e',
                height: '400px'
            }}
        >
            <Editor
                height="100%"
                language={language || 'javascript'}
                value={code || ''}
                theme="vs-dark"
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        useShadows: false,
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10,
                    },
                }}
                onChange={handleEditorChange}
            />
        </motion.div>
    );
};

export default EditorWrapper;
