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

export interface ReportData {
  startDate: string;
  endDate: string;
  relatedLinks: string;
  content: string;
}

interface ReportFormProps {
  data: ReportData;
  onChange: (data: ReportData) => void;
}

const ReportForm = ({ data, onChange }: ReportFormProps) => {
  const handleChange = (field: keyof ReportData, value: string | Date | null) => {
    const stringValue = value instanceof Date ? format(value, "yyyy-MM-dd") : value || '';
    onChange({ ...data, [field]: stringValue });
  };

  const toDate = (dateString: string) => dateString ? new Date(dateString) : undefined;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate" className="text-sm font-medium text-gray-900 mb-1 block">보고 시작일</Label>
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
          <Label htmlFor="endDate" className="text-sm font-medium text-gray-900 mb-1 block">보고 종료일</Label>
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
