
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, FileText, Calendar, Plane, Building, ClipboardList, BarChart3 } from "lucide-react";
import RecipientSelector from '../components/RecipientSelector';
import LeaveForm from '../components/LeaveForm';
import TripForm from '../components/TripForm';
import ReportForm from '../components/ReportForm';
import { Recipient } from '../data/recipients';

const Index = () => {
  const [formData, setFormData] = useState({
    recipients: [] as Recipient[],
    subject: '',
    template: ''
  });

  const [templateFormData, setTemplateFormData] = useState({
    leave: {
      startDate: '',
      endDate: '',
      period: '',
      reason: ''
    },
    trip: {
      startDate: '',
      endDate: '',
      destination: '',
      purpose: '',
      accommodation: ''
    },
    report: {
      startDate: '',
      endDate: '',
      relatedLinks: '',
      content: ''
    }
  });

  const [generatedEmail, setGeneratedEmail] = useState('');
  const [translatedSubject, setTranslatedSubject] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('korean');
  const [isTranslating, setIsTranslating] = useState(false);

  const templates = [
    { id: 'annual_leave', name: '연차 신청', icon: Calendar },
    { id: 'half_day_leave', name: '반차 신청', icon: Calendar },
    { id: 'business_trip', name: '출장 신청', icon: Plane },
    { id: 'dispatch', name: '파견 신청', icon: Building },
    { id: 'work_report', name: '업무 보고', icon: FileText },
    { id: 'weekly_report', name: '주간 보고', icon: BarChart3 }
  ];

  const languages = [
    { value: 'korean', label: '한국어' },
    { value: 'english', label: 'English' },
    { value: 'japanese', label: '日本語' },
    { value: 'chinese', label: '中文' }
  ];

  const handleInputChange = (field: string, value: string | Recipient[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = () => {
    setGeneratedEmail("안녕하세요,\n\n위와 같이 신청드리오니 검토 후 승인 부탁드립니다.\n\n감사합니다.");
    setTranslatedSubject(formData.subject);
    setCurrentLanguage('korean');
  };

  const handleTranslate = async (targetLanguage: string) => {
    if (!generatedEmail || targetLanguage === currentLanguage) return;
    
    setIsTranslating(true);
    
    // 실제 구현에서는 LLM API 호출
    setTimeout(() => {
      let translatedText = '';
      let translatedSubjectText = '';
      
      switch (targetLanguage) {
        case 'english':
          translatedText = "Hello,\n\nI would like to request as mentioned above. Please review and approve.\n\nThank you.";
          translatedSubjectText = formData.subject ? `Request: ${formData.subject}` : '';
          break;
        case 'japanese':
          translatedText = "こんにちは、\n\n上記の通り申請いたします。ご検討の上、承認をお願いいたします。\n\nありがとうございます。";
          translatedSubjectText = formData.subject ? `申請: ${formData.subject}` : '';
          break;
        case 'chinese':
          translatedText = "您好，\n\n如上所述提出申请，请审核后批准。\n\n谢谢。";
          translatedSubjectText = formData.subject ? `申请: ${formData.subject}` : '';
          break;
        default:
          translatedText = "안녕하세요,\n\n위와 같이 신청드리오니 검토 후 승인 부탁드립니다.\n\n감사합니다.";
          translatedSubjectText = formData.subject;
      }
      
      setGeneratedEmail(translatedText);
      setTranslatedSubject(translatedSubjectText);
      setCurrentLanguage(targetLanguage);
      setIsTranslating(false);
    }, 1000);
  };

  const selectedTemplate = templates.find(t => t.id === formData.template);

  const renderTemplateForm = () => {
    switch (formData.template) {
      case 'annual_leave':
        return (
          <LeaveForm
            data={templateFormData.leave}
            onChange={(data) => setTemplateFormData(prev => ({ ...prev, leave: data }))}
            isHalfDay={false}
          />
        );
      case 'half_day_leave':
        return (
          <LeaveForm
            data={templateFormData.leave}
            onChange={(data) => setTemplateFormData(prev => ({ ...prev, leave: data }))}
            isHalfDay={true}
          />
        );
      case 'business_trip':
        return (
          <TripForm
            data={templateFormData.trip}
            onChange={(data) => setTemplateFormData(prev => ({ ...prev, trip: data }))}
            isDispatch={false}
          />
        );
      case 'dispatch':
        return (
          <TripForm
            data={templateFormData.trip}
            onChange={(data) => setTemplateFormData(prev => ({ ...prev, trip: data }))}
            isDispatch={true}
          />
        );
      case 'work_report':
      case 'weekly_report':
        return (
          <ReportForm
            data={templateFormData.report}
            onChange={(data) => setTemplateFormData(prev => ({ ...prev, report: data }))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-noto">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-gray-700 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-900">이메일 작성 도우미</h1>
          </div>
          <p className="text-gray-600">업무용 이메일을 빠르고 정확하게 작성해보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-lg font-medium text-gray-900">기본 정보 입력</CardTitle>
                <CardDescription className="text-gray-600">
                  이메일 작성에 필요한 기본 정보를 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">템플릿 선택</Label>
                  <div className="flex flex-wrap gap-2">
                    {templates.map((template) => {
                      const IconComponent = template.icon;
                      return (
                        <Badge
                          key={template.id}
                          variant={formData.template === template.id ? "default" : "outline"}
                          className={`cursor-pointer px-3 py-2 text-xs font-medium transition-all ${
                            formData.template === template.id
                              ? 'bg-gray-900 text-white hover:bg-gray-800'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => handleInputChange('template', template.id)}
                        >
                          <IconComponent className="h-3 w-3 mr-1" />
                          {template.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <RecipientSelector
                  selectedRecipients={formData.recipients}
                  onRecipientsChange={(recipients) => handleInputChange('recipients', recipients)}
                />

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-900">제목</Label>
                  <Input
                    id="subject"
                    placeholder="이메일 제목을 입력하세요"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  />
                </div>

                {formData.template && (
                  <div className="pt-4 border-t border-gray-200">
                    <Label className="text-sm font-medium text-gray-900 mb-4 block">상세 정보</Label>
                    {renderTemplateForm()}
                  </div>
                )}

                <Button 
                  onClick={handleGenerate}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3"
                  disabled={!formData.template || formData.recipients.length === 0 || !formData.subject}
                >
                  <Send className="h-4 w-4 mr-2" />
                  이메일 생성하기
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-medium text-gray-900">생성된 이메일</CardTitle>
                    <CardDescription className="text-gray-600">
                      AI가 생성한 이메일 내용을 확인하세요
                    </CardDescription>
                  </div>
                  {generatedEmail && (
                    <div className="flex items-center gap-2">
                      <Select 
                        value={currentLanguage} 
                        onValueChange={handleTranslate}
                        disabled={isTranslating}
                      >
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value} className="text-xs">
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {generatedEmail ? (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">받는 사람:</span> {formData.recipients.map(r => r.email).join(', ')}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-bold">제목:</span> {translatedSubject || formData.subject}
                      </div>
                    </div>
                    <div className="text-gray-800 whitespace-pre-wrap relative">
                      {isTranslating && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded">
                          <div className="text-sm text-gray-500">번역 중...</div>
                        </div>
                      )}
                      {generatedEmail}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">템플릿을 선택하고 정보를 입력한 후<br />이메일 생성하기 버튼을 클릭하세요</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
