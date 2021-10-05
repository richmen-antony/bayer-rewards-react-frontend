import {AriaAttributes, DOMAttributes} from "react";

declare module "react-router-dom";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    class?: string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      th: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      td: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      table: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      img: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      label: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      input: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      strong: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      textarea: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      i: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      button: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      h8: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      h7: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
