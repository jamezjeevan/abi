import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { messagingService } from '../../services/messagingService';
import { ChatWindow } from '../../components/common/ChatWindow';
import { MessageSquare, GraduationCap } from 'lucide-react';

export const StudentMessages = () => {
  const { profile, user } = useAuth();
  const [student, setStudent] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);

  useEffect(() => {
    const loadConversation = async () => {
      const stu = await studentService.getProfile(user?.id || '44444444-4444-4444-4444-444444444444');
      setStudent(stu);

      const m = await studentService.getMentor(stu?.mentor_id);
      setMentor(m);

      const conv = await messagingService.startOrGetDirectConversation({
        userA: { id: user?.id || '44444444-4444-4444-4444-444444444444', name: profile?.full_name || 'Alex Rivera', role: 'student' },
        userB: { id: stu?.mentor_id || '33333333-3333-3333-3333-333333333333', name: stu?.mentor_name || 'Prof. Sarah Jenkins', role: 'faculty' },
        title: `Academic & Placement Mentoring`
      });

      setCurrentConversation(conv);
    };
    loadConversation();
  }, [user]);

  const mentorName = student?.mentor_name || mentor?.name || 'Prof. Sarah Jenkins';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Direct Mentorship Messaging</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Chat with Faculty Mentor: {mentorName}
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Direct real-time communication for placement guidance, resume suggestions, and interview queries.
        </p>
      </div>

      <ChatWindow
        conversationId={currentConversation?.id}
        currentUserId={user?.id || '44444444-4444-4444-4444-444444444444'}
        currentUserName={profile?.full_name || 'Alex Rivera'}
        title={`Mentorship: ${mentorName}`}
        subtitle={`${mentor?.department || 'Computer Science & Engineering'} • faculty@campusconnect.edu`}
      />
    </div>
  );
};
