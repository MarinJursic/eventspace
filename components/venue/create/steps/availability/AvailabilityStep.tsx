import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { IVenueClientState } from "@/types/venue.types";
import { recurrenceRules, weekdays } from "./VenueAvailabilityValues";

enum recurrenceRuleTypes {
  WEEKLY = "weekly",
  BIWEEKLY = "biweekly",
  MONTHLY = "monthly",
}

export default function AvailabilityStep({
  venue,
  setVenue,
}: {
  venue: IVenueClientState;
  setVenue: Dispatch<SetStateAction<IVenueClientState>>;
}) {
  const [weekday, setWeekday] = React.useState<string>("");
  const [recurrenceRule, setRecurrenceRule] =
    React.useState<recurrenceRuleTypes>(recurrenceRuleTypes.WEEKLY);

  const handleAddBlockedWeekday = () => {
    if (weekday && recurrenceRule && venue.availabilityRules) {
      const newBlockedWeekday = {
        weekday,
        recurrenceRule,
      };

      setVenue({
        ...venue,
        availabilityRules: {
          ...venue.availabilityRules,
          blockedWeekdays: [
            ...venue.availabilityRules.blockedWeekdays,
            newBlockedWeekday,
          ],
        },
      });

      setWeekday("");
    }
  };

  const handleRemoveBlockedWeekday = (index: number) => {
    if (!venue.availabilityRules) return;
    setVenue({
      ...venue,
      availabilityRules: {
        ...venue.availabilityRules,
        blockedWeekdays: venue.availabilityRules.blockedWeekdays.filter(
          (_, i) => i !== index
        ),
      },
    });
  };

  if (!venue.availabilityRules) return <></>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-8">
        <h1 className="font-bold text-3xl pb-2">Availability</h1>

        <div>
          <h3 className="text-lg font-medium mb-4">Block Recurring Days</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Select value={weekday} onValueChange={setWeekday}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a weekday" />
                </SelectTrigger>
                <SelectContent>
                  {weekdays.map((day) => (
                    <SelectItem key={day.id} value={day.id}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={recurrenceRule}
                onValueChange={(value: recurrenceRuleTypes) =>
                  setRecurrenceRule(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recurrence" />
                </SelectTrigger>
                <SelectContent>
                  {recurrenceRules.map((rule) => (
                    <SelectItem key={rule.value} value={rule.value}>
                      {rule.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleAddBlockedWeekday}
                disabled={!weekday || !recurrenceRule}
                className="w-full"
              >
                Add Blocked Weekday
              </Button>
            </div>

            {venue.availabilityRules.blockedWeekdays.length === 0 ? (
              <>
                <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
                  No recurring blocks set. Your venue is available every day of
                  the week.
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="font-medium text-sm">
                    Currently Blocked Weekdays:
                  </p>
                  {venue.availabilityRules.blockedWeekdays.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <div>
                          <span className="capitalize font-medium">
                            {item.weekday}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({item.recurrenceRule})
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveBlockedWeekday(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
