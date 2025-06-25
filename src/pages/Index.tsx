
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    { id: 'annual_leave', name: '연차 신청', icon: Calendar, description: '연차 휴가 신청을 위한 이메일' },
    { id: 'half_day_leave', name: '반차 신청', icon: Calendar, description: '반일 휴가 신청을 위한 이메일' },
    { id: 'business_trip', name: '출장 신청', icon: Plane, description: '업무 출장 신청을 위한 이메일' },
    { id: 'dispatch', name: '파견 신청', icon: Building, description: '타 부서/지점 파견 신청을 위한 이메일' },
    { id: 'work_report', name: '업무 보고', icon: FileText, description: '일반 업무 진행 상황 보고' },
    { id: 'weekly_report', name: '주간 보고', icon: BarChart3, description: '주간 업무 요약 및 계획 보고' }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">이메일 작성 도우미</h1>
          </div>
          <p className="text-gray-600 text-lg">업무용 이메일을 빠르고 정확하게 작성해보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            {/* Template Selection */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" />
                  템플릿 선택
                </CardTitle>
                <CardDescription className="text-blue-100">
                  작성하려는 이메일의 유형을 선택해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {templates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleInputChange('template', template.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
                          formData.template === template.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <IconComponent className={`h-5 w-5 mr-2 ${
                            formData.template === template.id ? 'text-blue-600' : 'text-gray-500'
                          }`} />
                          <span className="font-medium text-gray-800">{template.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information Form */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  기본 정보 입력
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  이메일 작성에 필요한 기본 정보를 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="recipient" className="text-gray-700 font-medium">받는 사람</Label>
                  <Input
                    id="recipient"
                    placeholder="예: manager@company.com"
                    value={formData.recipient}
                    onChange={(e) => handleInputChange('recipient', e.target.value)}
                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-gray-700 font-medium">제목</Label>
                  <Input
                    id="subject"
                    placeholder="이메일 제목을 입력하세요"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="language" className="text-gray-700 font-medium">언어</Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                  <Label htmlFor="additionalInfo" className="text-gray-700 font-medium">추가 정보</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="날짜, 사유, 기간 등 이메일에 포함될 구체적인 내용을 입력해주세요"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>

                <Button 
                  onClick={handleGenerate}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 transition-all duration-200"
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
            {/* Selected Template Info */}
            {selectedTemplate && (
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <selectedTemplate.icon className="h-5 w-5 mr-2" />
                    선택된 템플릿
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <selectedTemplate.icon className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{selectedTemplate.name}</h3>
                      <p className="text-gray-600">{selectedTemplate.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Email Preview */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  생성된 이메일
                </CardTitle>
                <CardDescription className="text-purple-100">
                  AI가 생성한 이메일 내용을 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {generatedEmail ? (
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>받는 사람:</strong> {formData.recipient}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        <strong>제목:</strong> {formData.subject}
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{generatedEmail}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>템플릿을 선택하고 정보를 입력한 후<br />이메일 생성하기 버튼을 클릭하세요</p>
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
