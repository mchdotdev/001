/* eslint-disable @typescript-eslint/indent */
import { useEffect, ReactNode, FC } from 'react';

export interface Props {
  dir: 'lr' | 'rl' | 'tb' | 'bt';
  tw?: string;
  children: ReactNode;
}

const AOS: FC<Props> = ({ dir, tw, children }) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(`show-aos-${dir}`);
        } else {
          // entry.target.classList.remove(`show-aos-${dir}`);
        }
      });
    });
    const hidden = document.querySelectorAll(`.hidden-aos-${dir}`);
    hidden.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className={`${tw} ${dir.includes('r') ? 'overflow-hidden' : ''}`}>
      <div className={`hidden-aos-${dir}`}>{children}</div>
    </div>
  );
};

export default AOS;
