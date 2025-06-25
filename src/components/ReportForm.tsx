
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ReportFormData {
  startDate: string;
  endDate: string;
  relatedLinks: string;
  content: string;
}

interface ReportFormProps {
  data: ReportFormData;
  onChange: (data: ReportFormData) => void;
}

const ReportForm = ({ data, onChange }: ReportFormProps) => {
  const handleChange = (field: keyof ReportFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate" className="text-sm font-medium text-gray-900">보고 시작일</Label>
          <Input
            id="startDate"
            type="date"
            value={data.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="endDate" className="text-sm font-medium text-gray-900">보고 종료일</Label>
          <Input
            id="endDate"
            type="date"
            value={data.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="relatedLinks" className="text-sm font-medium text-gray-900">관련 링크</Label>
        <Textarea
          id="relatedLinks"
          placeholder="관련 링크들을 입력해주세요 (한 줄에 하나씩)"
          value={data.relatedLinks}
          onChange={(e) => handleChange('relatedLinks', e.target.value)}
          className="mt-1 min-h-[60px]"
        />
      </div>

      <div>
        <Label htmlFor="content" className="text-sm font-medium text-gray-900">보고 내용</Label>
        <Textarea
          id="content"
          placeholder="보고할 내용을 입력해주세요"
          value={data.content}
          onChange={(e) => handleChange('content', e.target.value)}
          className="mt-1 min-h-[120px]"
        />
      </div>

      <div>
        <Label htmlFor="file" className="text-sm font-medium text-gray-900">파일 첨부</Label>
        <Input
          id="file"
          type="file"
          multiple
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">여러 파일을 선택할 수 있습니다.</p>
      </div>
    </div>
  );
};

export default ReportForm;
