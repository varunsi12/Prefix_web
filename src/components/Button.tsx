import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type AnchorProps = BaseProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
type NativeButtonProps = BaseProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = AnchorProps | NativeButtonProps;

/** Renders an <a> when `href` is supplied, otherwise a <button>. */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props;
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchor } = rest as AnchorProps;
    return (
      <a href={href} className={cls} {...anchor}>
        {children}
      </a>
    );
  }
  const button = rest as NativeButtonProps;
  return (
    <button type="button" className={cls} {...button}>
      {children}
    </button>
  );
}
