import React, { useState } from 'react';
import '../styles/commentTable.css';

export default function CommentTable({ comments, postsById, filterText, onEdit }) {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = comments.filter(c =>
    c.email.includes(filterText) ||
    c.name.includes(filterText) ||
    c.body.includes(filterText)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageSlice = filtered.slice((page - 1)*perPage, page*perPage);

  return (
    <div className="table-container">
      <table className="comment-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Body</th>
            <th>Post</th>
          </tr>
        </thead>
        <tbody>
          {pageSlice.map(c => (
            <tr key={c.id}>
              <td>{c.email}</td>
              <EditableCell
                value={c.name}
                onChange={val => onEdit(c.id, 'name', val)}
              />
              <EditableCell
                value={c.body}
                onChange={val => onEdit(c.id, 'body', val)}
              />
              <td>{postsById[c.postId] || '...'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

function EditableCell({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  React.useEffect(() => { setText(value); }, [value]);

  return (
    <td onClick={() => setEditing(true)}>
      {editing ? (
        <input
          type="text"
          className="inplace-input"
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={() => { setEditing(false); onChange(text); }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setEditing(false);
              onChange(text);
            }
          }}
          autoFocus
        />
      ) : (
        text
      )}
    </td>
  );
}
