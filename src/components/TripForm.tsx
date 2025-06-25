
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TripFormData {
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
  accommodation: string;
}

interface TripFormProps {
  data: TripFormData;
  onChange: (data: TripFormData) => void;
  isDispatch: boolean;
}

const TripForm = ({ data, onChange, isDispatch }: TripFormProps) => {
  const handleChange = (field: keyof TripFormData, value: string) => {
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

      <div>
        <Label htmlFor="destination" className="text-sm font-medium text-gray-900">
          {isDispatch ? '파견지' : '출장지'}
        </Label>
        <Input
          id="destination"
          placeholder={isDispatch ? "파견지를 입력해주세요" : "출장지를 입력해주세요"}
          value={data.destination}
          onChange={(e) => handleChange('destination', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="purpose" className="text-sm font-medium text-gray-900">목적</Label>
        <Textarea
          id="purpose"
          placeholder={isDispatch ? "파견 목적을 입력해주세요" : "출장 목적을 입력해주세요"}
          value={data.purpose}
          onChange={(e) => handleChange('purpose', e.target.value)}
          className="mt-1 min-h-[80px]"
        />
      </div>

      <div>
        <Label htmlFor="accommodation" className="text-sm font-medium text-gray-900">숙박 정보</Label>
        <Input
          id="accommodation"
          placeholder="숙박 예정지를 입력해주세요"
          value={data.accommodation}
          onChange={(e) => handleChange('accommodation', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default TripForm;
