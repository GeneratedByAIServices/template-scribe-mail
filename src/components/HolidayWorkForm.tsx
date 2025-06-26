import React from 'react';
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface HolidayWorkData {
  workDate: string;
  workHours: string;
  reason: string;
}

interface HolidayWorkFormProps {
  data: HolidayWorkData;
  onChange: (data: HolidayWorkData) => void;
}

const HolidayWorkForm = ({ data, onChange }: HolidayWorkFormProps) => {
  const handleChange = (field: keyof HolidayWorkData, value: string | Date | null) => {
    const stringValue = value instanceof Date ? format(value, "yyyy-MM-dd") : value || '';
    onChange({ ...data, [field]: stringValue });
  };

  const toDate = (dateString: string) => dateString ? new Date(dateString) : undefined;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="workDate" className="text-sm font-medium text-gray-900 mb-1 block">근무일</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !data.workDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.workDate ? format(toDate(data.workDate)!, "PPP (E)", { locale: ko }) : <span>날짜 선택</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={toDate(data.workDate)}
              onSelect={(date) => handleChange('workDate', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <Label htmlFor="workHours" className="text-sm font-medium text-gray-900">근무 시간</Label>
        <Input
          id="workHours"
          placeholder="예: 09:00 ~ 13:00"
          value={data.workHours}
          onChange={(e) => handleChange('workHours', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="reason" className="text-sm font-medium text-gray-900">사유</Label>
        <Textarea
          id="reason"
          placeholder="휴일 근무 사유를 입력해주세요"
          value={data.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          className="mt-1 min-h-[80px]"
        />
      </div>
    </div>
  );
};

export default HolidayWorkForm; 