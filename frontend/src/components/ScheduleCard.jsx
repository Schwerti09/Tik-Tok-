import React from 'react';
import { Calendar, Instagram, Youtube } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const PlatformIcon = ({ platform }) => {
  if (platform === 'instagram') return <Instagram size={14} className="text-pink-400" />;
  if (platform === 'youtube')   return <Youtube size={14} className="text-red-400" />;
  return <span className="text-xs font-bold text-cyan-400">TT</span>;
};

export default function ScheduleCard({ post }) {
  const { platform, caption, scheduledAt, thumbnail } = post;
  const date = scheduledAt ? new Date(scheduledAt) : new Date();

  return (
    <div className="glass-card p-4 hover:bg-white/10 transition-all duration-200 group">
      <div className="flex items-start gap-3">
        {thumbnail ? (
          <img src={thumbnail} alt="" className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
        ) : (
          <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-violet-600/30 to-pink-600/30 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <PlatformIcon platform={platform} />
            <span className="text-xs text-gray-400 capitalize">{platform}</span>
          </div>
          <p className="text-sm text-white line-clamp-2 leading-relaxed">{caption}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Calendar size={12} className="text-gray-500" />
            <p className="text-xs text-gray-400">
              {format(date, "dd. MMM yyyy, HH:mm 'Uhr'", { locale: de })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
