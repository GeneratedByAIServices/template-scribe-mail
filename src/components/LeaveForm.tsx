
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface LeaveFormData {
  startDate: string;
  endDate: string;
  period: string;
  reason: string;
}

interface LeaveFormProps {
  data: LeaveFormData;
  onChange: (data: LeaveFormData) => void;
  isHalfDay: boolean;
}

const LeaveForm = ({ data, onChange, isHalfDay }: LeaveFormProps) => {
  const handleChange = (field: keyof LeaveFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate" className="text-sm font-medium text-gray-900">시작일</Label>
          <Input
            id="startDate"
            type="date"
            value={data.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="endDate" className="text-sm font-medium text-gray-900">종료일</Label>
          <Input
            id="endDate"
            type="date"
            value={data.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {isHalfDay && (
        <div>
          <Label className="text-sm font-medium text-gray-900">반차 구분</Label>
          <Select value={data.period} onValueChange={(value) => handleChange('period', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="오전/오후 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">오전 반차</SelectItem>
              <SelectItem value="afternoon">오후 반차</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="reason" className="text-sm font-medium text-gray-900">사유</Label>
        <Textarea
          id="reason"
          placeholder="휴가 사유를 입력해주세요"
          value={data.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          className="mt-1 min-h-[80px]"
        />
      </div>
    </div>
  );
};

export default LeaveForm;
