export default function Button({ variant = 'primary', className = '', children, ...props }) {
  const variants = {
    primary:
      'bg-gradient-to-r from-brand-600 to-teal-accent text-white shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 disabled:hover:translate-y-0',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700',
    ghost: 'text-brand-700 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10',
    danger: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40',
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 font-medium text-sm rounded-xl px-4 py-2.5
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
