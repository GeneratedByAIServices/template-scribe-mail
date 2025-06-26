import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, FileText, Calendar, Plane, Building, ClipboardList, BarChart3, ClipboardCopy } from "lucide-react";
import RecipientSelector from '../components/RecipientSelector';
import LeaveForm, { LeaveData } from '../components/LeaveForm';
import TripForm, { TripData } from '../components/TripForm';
import ReportForm, { ReportData } from '../components/ReportForm';
import HolidayWorkForm, { HolidayWorkData } from '../components/HolidayWorkForm';
import { Recipient } from '../data/recipients';
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type MyInfo = {
  name: string;
  department: string;
  position: string;
  email: string;
  fixedClosingRemark: string;
};

// 기본 마무리 멘트
const DEFAULT_CLOSING_REMARKS = {
  annual_leave: '휴가 기간 동안 업무에 차질이 없도록 하겠습니다. 감사합니다.',
  half_day_leave: '업무에 불편을 드려 죄송합니다. 너그러이 양해해주시면 감사하겠습니다.',
  business_trip: '출장 기간 동안에도 원활한 소통이 가능하도록 하겠습니다. 감사합니다.',
  dispatch: '파견 기간 동안 맡은 바 임무를 충실히 수행하겠습니다. 감사합니다.',
  work_report: '검토 후 피드백 부탁드립니다. 감사합니다.',
  weekly_report: '주간 업무 내용을 확인 부탁드립니다. 감사합니다.',
  holiday_work: '휴일 근무 신청을 검토해주셔서 감사합니다.',
};

const Index = () => {
  const [myInfo, setMyInfo] = useState<MyInfo>({
    name: '',
    department: '',
    position: '',
    email: '',
    fixedClosingRemark: '',
  });

  const [closingRemarks, setClosingRemarks] = useState(DEFAULT_CLOSING_REMARKS);

  const [formData, setFormData] = useState({
    recipients: [] as Recipient[],
    template: '',
    details: '',
  });

  const [templateFormData, setTemplateFormData] = useState({
    leave: {
      startDate: '',
      endDate: '',
      period: '',
      reason: ''
    } as LeaveData,
    trip: {
      startDate: '',
      endDate: '',
      destination: '',
      purpose: '',
      accommodation: ''
    } as TripData,
    report: {
      startDate: '',
      endDate: '',
      relatedLinks: '',
      content: ''
    } as ReportData,
    holiday_work: {
      workDate: '',
      workHours: '',
      reason: ''
    } as HolidayWorkData
  });

  const [generatedEmail, setGeneratedEmail] = useState('');
  const [translatedSubject, setTranslatedSubject] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('korean');
  const [isTranslating, setIsTranslating] = useState(false);
  const [loading, setLoading] = useState(false);

  const templates = [
    { id: 'annual_leave', name: '연차 신청', icon: Calendar },
    { id: 'half_day_leave', name: '반차 신청', icon: Calendar },
    { id: 'business_trip', name: '출장 신청', icon: Plane },
    { id: 'dispatch', name: '파견 신청', icon: Building },
    { id: 'work_report', name: '업무 보고', icon: FileText },
    { id: 'weekly_report', name: '주간 보고', icon: BarChart3 },
    { id: 'holiday_work', name: '휴일 근무', icon: ClipboardList },
  ];

  const languages = [
    { value: 'korean', label: '한국어' },
    { value: 'english', label: 'English' },
    { value: 'japanese', label: '日本語' },
    { value: 'chinese', label: '中文' }
  ];

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedInfo = localStorage.getItem('myInfo');
    if (savedInfo) {
      setMyInfo(JSON.parse(savedInfo));
    }
    const savedRemarks = localStorage.getItem('closingRemarks');
    if (savedRemarks) {
      setClosingRemarks(JSON.parse(savedRemarks));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('myInfo', JSON.stringify(myInfo));
  }, [myInfo]);

  useEffect(() => {
    localStorage.setItem('closingRemarks', JSON.stringify(closingRemarks));
  }, [closingRemarks]);

  const handleMyInfoChange = (field: keyof MyInfo, value: string) => {
    setMyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: string, value: string | Recipient[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    setGeneratedEmail("");
    setTranslatedSubject('');
    setLoading(true);

    const recipientsText = formData.recipients.map(r => `${r.name} ${r.position || ''}`.trim()).join(', ');
    const recipientGreeting = formData.recipients.map(r => `${r.name} ${r.position || ''}`.trim() + '님').join(', ');

    let detailsText = '';
    const selectedTemplate = templates.find(t => t.id === formData.template);

    const formatDateWithDay = (dateString: string) => {
      if (!dateString) return '';
      return format(new Date(dateString), "yyyy-MM-dd (E)", { locale: ko });
    };

    switch (formData.template) {
      case 'annual_leave':
        {
          const { startDate, endDate, reason } = templateFormData.leave;
          let durationText = '';
          if (startDate && endDate) {
            const duration = differenceInDays(new Date(endDate), new Date(startDate)) + 1;
            durationText = `${duration}일`;
          }
          detailsText = `
            - 휴가 종류: ${selectedTemplate?.name}
            - 시작일: ${formatDateWithDay(startDate)}
            - 종료일: ${formatDateWithDay(endDate)}
            - 기간: ${durationText}
            - 사유: ${reason}
          `;
        }
        break;
      case 'half_day_leave':
        detailsText = `
          - 휴가 종류: ${selectedTemplate?.name}
          - 날짜: ${formatDateWithDay(templateFormData.leave.startDate)}
          - 구분: ${templateFormData.leave.period}
          - 사유: ${templateFormData.leave.reason}
        `;
        break;
      case 'business_trip':
      case 'dispatch':
        {
          const { startDate, endDate, destination, purpose, accommodation } = templateFormData.trip;
           let durationText = '';
          if (startDate && endDate) {
            const duration = differenceInDays(new Date(endDate), new Date(startDate)) + 1;
            durationText = `${duration}일`;
          }
          detailsText = `
            - 종류: ${selectedTemplate?.name}
            - 시작일: ${formatDateWithDay(startDate)}
            - 종료일: ${formatDateWithDay(endDate)}
            - 기간: ${durationText}
            - 목적지: ${destination}
            - 목적: ${purpose}
            - 숙소: ${accommodation}
          `;
        }
        break;
      case 'work_report':
      case 'weekly_report':
        detailsText = `
          - 보고 종류: ${selectedTemplate?.name}
          - 보고 기간: ${formatDateWithDay(templateFormData.report.startDate)} ~ ${formatDateWithDay(templateFormData.report.endDate)}
          - 관련 링크: ${templateFormData.report.relatedLinks}
          - 상세 내용: ${templateFormData.report.content}
        `;
        break;
      case 'holiday_work':
        detailsText = `
          - 근무일: ${formatDateWithDay(templateFormData.holiday_work.workDate)}
          - 근무 시간: ${templateFormData.holiday_work.workHours}
          - 사유: ${templateFormData.holiday_work.reason}
        `;
        break;
      default:
        detailsText = formData.details;
    }

    const subjectPrompt = `
- 다음 정보를 바탕으로 이메일 제목만 생성해줘. 다른 말은 절대 붙이지 마.
- 형식: "[템플릿 종류] 주요 내용 요약, 이름" (반드시 대괄호 "[]"를 사용해야 함)
- 정보:
  템플릿 종류: ${selectedTemplate?.name}
  핵심 내용: ${detailsText}
  작성자: ${myInfo.name}
`;

    const bodyPrompt = `
- 수신자: ${recipientsText}
- 작성자: ${myInfo.department} ${myInfo.position} ${myInfo.name}
- 핵심 내용: ${detailsText}
- 마무리 멘트: ${myInfo.fixedClosingRemark || closingRemarks[formData.template as keyof typeof closingRemarks] || ''}
---
위 정보를 바탕으로 다음 요구사항을 엄격히 지켜서 Gmail에 바로 붙여넣을 수 있는 완전한 HTML 형식의 이메일 본문만 작성해줘.

**요구사항:**
1.  **인사말 (매우 중요):** '${recipientGreeting} 안녕하세요.' 로 시작하고, 바로 다음 줄에 '저는 ${myInfo.department} ${myInfo.position} ${myInfo.name}입니다.' 라고 소개하는 문장을 추가해줘. **여기서 제공된 부서, 직급, 이름 정보는 절대 수정하거나 바꾸지 말고 그대로 사용해야 해.**
2.  **핵심 정보:** 전달할 핵심 정보는 반드시 <ul>과 <li> 태그를 사용해서 명확하게 정리해줘.
3.  **가독성:** 문단과 문단 사이, 인사말과 본문 사이에는 충분한 여백(<p> 또는 <br>)을 두어 가독성을 높여줘.
4.  **어조:** 수신자의 직급과 호칭에 유의하여 격식있고 전문적인 어조를 사용해줘.
5.  **태그 제한:** HTML 구조는 <p>, <strong>, <ul>, <li>, <br> 태그만 사용해줘.
6.  **스타일 금지:** 절대로 CSS 스타일이나 다른 HTML 태그는 사용하지 마.
7.  **서명 금지:** 이메일 마지막에 별도의 서명(이름, 부서, 연락처 등)을 추가하지 마.
8.  **순수 HTML:** 응답은 순수한 HTML 코드만 포함하고, 절대로 마크다운 코드 블록(\`\`\`)으로 감싸지 마.
9.  **줄 바꿈:** 문장이 길어지는 경우, 의미 단위로 적절히 줄바꿈(<br> 태그 사용)하여 가독성을 높여줘.
`;
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setGeneratedEmail("API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.");
        setLoading(false);
        return;
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // 1. Generate Subject
      const subjectResult = await model.generateContent(subjectPrompt);
      const finalSubject = subjectResult.response.text().replace(/"/g, '').trim();
      setTranslatedSubject(finalSubject);

      // 2. Generate Email Body
      const bodyResult = await model.generateContent(bodyPrompt);
      let emailContent = bodyResult.response.text();
      emailContent = emailContent.replace(/```html/g, '').replace(/```/g, '').trim();
      setGeneratedEmail(emailContent || "이메일 생성에 실패했습니다.");

    } catch (error) {
      console.error("Error generating email:", error);
      setGeneratedEmail("API 키가 유효하지 않거나 다른 오류가 발생했습니다. F12를 눌러 콘솔을 확인해주세요.");
    }

    setLoading(false);
  };

  const handleTranslate = async (targetLanguage: string) => {
    if (!generatedEmail || targetLanguage === currentLanguage) return;
    
    setIsTranslating(true);
    toast.info(`${targetLanguage}(으)로 번역을 시작합니다...`);

    const translationPrompt = `
      You are a professional translator. Translate the following email subject and body into ${targetLanguage}.
      - IMPORTANT: Preserve the HTML tags and structure (like <p>, <ul>, <li>, <strong>, <br>) in the email body perfectly.
      - Your response must be a single, valid JSON object with two keys: "subject" and "body". Do not include any other text or markdown.

      {
        "subject": "${translatedSubject}",
        "body": "${generatedEmail.replace(/"/g, '\\"')}"
      }
    `;
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        toast.error("API 키가 설정되지 않았습니다.");
        setIsTranslating(false);
        return;
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(translationPrompt);
      const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      
      const translatedResult = JSON.parse(responseText);

      setTranslatedSubject(translatedResult.subject);
      setGeneratedEmail(translatedResult.body);
      setCurrentLanguage(targetLanguage);
      toast.success("번역이 완료되었습니다.");

    } catch (error) {
      console.error("Error translating email:", error);
      toast.error("번역 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = (text: string, type: '제목' | '내용') => {
    // For copying HTML content, create a temporary element to get the text version
    if (type === '내용') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = text;
      text = tempDiv.textContent || tempDiv.innerText || '';
    }

    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type}이(가) 클립보드에 복사되었습니다.`);
    }, (err) => {
      toast.error('복사에 실패했습니다.');
      console.error('Could not copy text: ', err);
    });
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
      case 'holiday_work':
        return (
          <HolidayWorkForm
            data={templateFormData.holiday_work}
            onChange={(data) => setTemplateFormData(prev => ({ ...prev, holiday_work: data as HolidayWorkData }))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-noto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-start mb-4">
            <img src="/SOLUTIONLINK_logo_symbol_color.png" alt="솔루션링크 로고" className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-900">솔루션링크 메일 작성 어시스턴트</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="space-y-6 lg:col-span-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>내 정보 입력</AccordionTrigger>
                <AccordionContent>
                  <div className="mt-4 space-y-4 rounded-lg border p-6">
                    <p className="text-sm text-muted-foreground">
                      이메일 서명에 사용될 정보를 입력하세요. (브라우저에
                      저장됩니다)
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="my-name">이름</Label>
                      <Input
                        id="my-name"
                        placeholder="홍길동"
                        value={myInfo.name}
                        onChange={(e) =>
                          handleMyInfoChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="my-department">부서</Label>
                      <Input
                        id="my-department"
                        placeholder="예: 프로젝트 공학부"
                        value={myInfo.department}
                        onChange={(e) =>
                          handleMyInfoChange("department", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="my-position">직급</Label>
                      <Input
                        id="my-position"
                        placeholder="예: 선임"
                        value={myInfo.position}
                        onChange={(e) =>
                          handleMyInfoChange("position", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="my-email">이메일</Label>
                      <Input
                        id="my-email"
                        type="email"
                        placeholder="name@example.com"
                        value={myInfo.email}
                        onChange={(e) =>
                          handleMyInfoChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="my-fixed-closing">고정된 마무리 멘트</Label>
                      <Textarea
                        id="my-fixed-closing"
                        placeholder="예: 감사합니다.&#10;홍길동 드림."
                        value={myInfo.fixedClosingRemark}
                        onChange={(e) => handleMyInfoChange("fixedClosingRemark", e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

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

                {!formData.template ? (
                  <Textarea
                    id="details"
                    placeholder="ex) 내일 오후 2시 회의 참석 요청"
                    className="min-h-[100px]"
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  />
                ) : null}

                {formData.template && (
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2 block">상세 정보</Label>
                    {renderTemplateForm()}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2 block">마무리 멘트 수정</Label>
                      <Textarea
                        value={closingRemarks[formData.template as keyof typeof closingRemarks] || ''}
                        onChange={(e) => setClosingRemarks(prev => ({ ...prev, [formData.template]: e.target.value }))}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleGenerate}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3"
                  disabled={!formData.template || formData.recipients.length === 0}
                >
                  <Send className="h-4 w-4 mr-2" />
                  이메일 생성하기
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-3">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-medium text-gray-900">생성된 이메일</CardTitle>
                    <CardDescription className="text-gray-600">
                      AI가 생성한 이메일 내용을 확인하세요
                    </CardDescription>
                  </div>
                  {generatedEmail && !loading && (
                    <div className="flex items-center space-x-2">
                      <Select onValueChange={(value) => handleTranslate(value)} value={currentLanguage}>
                        <SelectTrigger className="w-[120px] h-9 text-xs border-gray-300">
                          <SelectValue placeholder="언어 선택" />
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
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <p>이메일을 생성하는 중입니다...</p>
                      </div>
                ) : generatedEmail ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                         <Label className="text-sm font-medium">제목</Label>
                         <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(translatedSubject, '제목')}>
                           <ClipboardCopy className="h-4 w-4" />
                         </Button>
                      </div>
                      <Input
                        id="generated-subject"
                        value={translatedSubject}
                        onChange={(e) => setTranslatedSubject(e.target.value)}
                        className="p-3 h-auto border rounded-md bg-gray-50 text-sm text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">내용</Label>
                         <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(generatedEmail, '내용')}>
                           <ClipboardCopy className="h-4 w-4" />
                         </Button>
                        </div>
                      <div 
                        className="p-3 border rounded-md bg-gray-50 h-80 overflow-y-auto text-sm"
                        dangerouslySetInnerHTML={{ __html: generatedEmail }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500">
                    <Mail className="h-10 w-10 mb-2" />
                    <p>이메일이 생성될 공간입니다</p>
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
