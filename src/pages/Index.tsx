
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, FileText, Calendar, Plane, Building, ClipboardList, BarChart3 } from "lucide-react";

const Index = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    template: '',
    additionalInfo: '',
    language: 'korean'
  });

  const [generatedEmail, setGeneratedEmail] = useState('');

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = () => {
    // 실제로는 여기서 LLM API 호출
    setGeneratedEmail("이메일이 생성되었습니다. (실제 구현 시 LLM API를 통해 생성됩니다)");
  };

  const selectedTemplate = templates.find(t => t.id === formData.template);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-gray-700 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-900">이메일 작성 도우미</h1>
          </div>
          <p className="text-gray-600">업무용 이메일을 빠르고 정확하게 작성해보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-lg font-medium text-gray-900">기본 정보 입력</CardTitle>
                <CardDescription className="text-gray-600">
                  이메일 작성에 필요한 기본 정보를 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Template Selection */}
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

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="recipient" className="text-sm font-medium text-gray-900">받는 사람</Label>
                    <Input
                      id="recipient"
                      placeholder="manager@company.com"
                      value={formData.recipient}
                      onChange={(e) => handleInputChange('recipient', e.target.value)}
                      className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>

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

                  <div>
                    <Label htmlFor="language" className="text-sm font-medium text-gray-900">언어</Label>
                    <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-900">추가 정보</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="날짜, 사유, 기간 등 이메일에 포함될 구체적인 내용을 입력해주세요"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500 min-h-[120px]"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3"
                  disabled={!formData.template || !formData.recipient || !formData.subject}
                >
                  <Send className="h-4 w-4 mr-2" />
                  이메일 생성하기
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-lg font-medium text-gray-900">생성된 이메일</CardTitle>
                <CardDescription className="text-gray-600">
                  AI가 생성한 이메일 내용을 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {generatedEmail ? (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">받는 사람:</span> {formData.recipient}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">제목:</span> {formData.subject}
                      </div>
                      {selectedTemplate && (
                        <div className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">템플릿:</span> {selectedTemplate.name}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-800 whitespace-pre-wrap">{generatedEmail}</div>
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
