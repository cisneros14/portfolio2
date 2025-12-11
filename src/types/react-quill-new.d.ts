declare module 'react-quill-new' {
    import React from 'react';
    
    export interface ReactQuillProps {
        theme?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        modules?: any;
        formats?: string[];
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        readOnly?: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange?: (content: string, delta: any, source: string, editor: any) => void;
        className?: string;
        style?: React.CSSProperties;
    }

    export default class ReactQuill extends React.Component<ReactQuillProps> {}
}
