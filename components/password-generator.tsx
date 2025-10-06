"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Copy, Check } from "lucide-react";
import {
  generatePassword,
  calculatePasswordStrength,
  PasswordOptions,
} from "@/lib/password-generator";

interface PasswordGeneratorProps {
  onUsePassword?: (password: string) => void;
}

export function PasswordGenerator({ onUsePassword }: PasswordGeneratorProps) {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
  });

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [usedMessage, setUsedMessage] = useState(false);

  useEffect(() => {
    generateNewPassword();
  }, [options]);

  const generateNewPassword = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = calculatePasswordStrength(password);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Password Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={password}
              readOnly
              className="font-mono text-lg"
              placeholder="Generated password"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={generateNewPassword}
              title="Generate new password"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${strength.color}`}
                style={{ width: `${(strength.score / 8) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium min-w-[60px]">
              {strength.label}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Length: {options.length}</Label>
            </div>
            <Slider
              value={[options.length]}
              onValueChange={([value]) =>
                setOptions({ ...options, length: value })
              }
              min={8}
              max={64}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={options.lowercase}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, lowercase: checked as boolean })
                }
              />
              <Label htmlFor="lowercase" className="cursor-pointer">
                Lowercase (a-z)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={options.uppercase}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, uppercase: checked as boolean })
                }
              />
              <Label htmlFor="uppercase" className="cursor-pointer">
                Uppercase (A-Z)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={options.numbers}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, numbers: checked as boolean })
                }
              />
              <Label htmlFor="numbers" className="cursor-pointer">
                Numbers (0-9)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={options.symbols}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, symbols: checked as boolean })
                }
              />
              <Label htmlFor="symbols" className="cursor-pointer">
                Symbols (!@#$%...)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="excludeSimilar"
                checked={options.excludeSimilar}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, excludeSimilar: checked as boolean })
                }
              />
              <Label htmlFor="excludeSimilar" className="cursor-pointer">
                Exclude similar characters (i, l, 1, L, o, 0, O)
              </Label>
            </div>
          </div>
        </div>

        {onUsePassword && (
          <>
            <Button
              onClick={() => {
                onUsePassword(password);
                setUsedMessage(true);
                setTimeout(() => setUsedMessage(false), 2000);
              }}
              className="w-full"
            >
              Use This Password
            </Button>

            {usedMessage && (
              <div className="text-green-600 text-center text-sm mt-2">
                Your password has been used.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
