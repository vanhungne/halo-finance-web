import PropTypes from "prop-types";

export function Table({ className = "", ...props }) {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className={`w-full caption-bottom text-sm text-left ${className}`} {...props} />
    </div>
  );
}

export function TableHeader({ className = "", ...props }) {
  return <thead className={`border-b border-slate-200 bg-slate-50/80 ${className}`} {...props} />;
}

export function TableBody({ className = "", ...props }) {
  return <tbody className={`divide-y divide-slate-100 ${className}`} {...props} />;
}

export function TableFooter({ className = "", ...props }) {
  return (
    <tfoot
      className={`border-t border-slate-200 bg-slate-50/50 font-medium ${className}`}
      {...props}
    />
  );
}

export function TableRow({ className = "", ...props }) {
  return (
    <tr
      className={`transition-colors hover:bg-sky-50/55 ${className}`}
      {...props}
    />
  );
}

export function TableHead({ className = "", ...props }) {
  return (
    <th
      className={`h-11 px-4 text-left align-middle font-extrabold text-[0.68rem] uppercase tracking-[0.12em] text-slate-500 whitespace-nowrap ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = "", ...props }) {
  return (
    <td
      className={`p-4 align-middle text-slate-700 text-sm ${className}`}
      {...props}
    />
  );
}

export function TableCaption({ className = "", ...props }) {
  return (
    <caption
      className={`mt-4 text-xs text-slate-400 ${className}`}
      {...props}
    />
  );
}

Table.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

TableHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

TableBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

TableFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

TableRow.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

TableHead.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

TableCell.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

TableCaption.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
