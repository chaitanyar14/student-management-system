import { Edit2, Trash2, Mail, Phone, BookOpen, User } from 'lucide-react';

const StudentCard = ({ student, onEdit, onDelete }) => {
  // Get initials for avatar
  const initials = student.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="card group">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-lg">
              {initials}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 leading-tight">
                {student.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {student.course || 'No course assigned'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={onEdit}
              className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={onDelete}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            <a href={`mailto:${student.email}`} className="hover:text-brand-600 truncate">
              {student.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{student.phone || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
