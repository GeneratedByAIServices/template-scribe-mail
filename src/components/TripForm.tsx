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

export interface TripData {
  startDate: string;
  endDate: string;
  destination: string;
  purpose: string;
  accommodation: string;
}

interface TripFormProps {
  data: TripData;
  onChange: (data: TripData) => void;
  isDispatch: boolean;
}

const TripForm = ({ data, onChange, isDispatch }: TripFormProps) => {
  const handleChange = (field: keyof TripData, value: string | Date | null) => {
    const stringValue = value instanceof Date ? format(value, "yyyy-MM-dd") : value || '';
    onChange({ ...data, [field]: stringValue });
  };

  const toDate = (dateString: string) => dateString ? new Date(dateString) : undefined;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate" className="text-sm font-medium text-gray-900 mb-1 block">시작일</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.startDate ? format(toDate(data.startDate)!, "PPP (E)", { locale: ko }) : <span>날짜 선택</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate(data.startDate)}
                onSelect={(date) => handleChange('startDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="endDate" className="text-sm font-medium text-gray-900 mb-1 block">종료일</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.endDate ? format(toDate(data.endDate)!, "PPP (E)", { locale: ko }) : <span>날짜 선택</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate(data.endDate)}
                onSelect={(date) => handleChange('endDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
