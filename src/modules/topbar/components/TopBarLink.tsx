import React from 'react';
import { Link } from 'react-router-dom';
import { TopBarLink as TopBarLinkType } from '../types';

interface TopBarLinkProps {
  link: TopBarLinkType;
  textColor: string;
  hoverColor: string;
  showSeparator?: boolean;
}

export function TopBarLink({ link, textColor, hoverColor, showSeparator }: TopBarLinkProps) {
  const linkStyle = {
    color: textColor,
    ['--hover-color' as any]: hoverColor,
  };

  const linkClasses = "text-sm transition-colors hover:text-[var(--hover-color)]";

  const content = link.isExternal ? (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClasses}
      style={linkStyle}
    >
      {link.label}
    </a>
  ) : (
    <Link
      to={link.href}
      className={linkClasses}
      style={linkStyle}
    >
      {link.label}
    </Link>
  );

  return (
    <>
      {content}
      {showSeparator && (
        <span style={{ color: `${textColor}50` }}>·</span>
      )}
    </>
  );
}
