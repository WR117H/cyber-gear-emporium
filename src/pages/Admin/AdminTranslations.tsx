
import React, { useState, useEffect } from 'react';
import { useLanguage, TranslationEntry } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function AdminTranslations() {
  const { translations, updateTranslation } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [editedTranslations, setEditedTranslations] = useState<Record<string, TranslationEntry>>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnglish, setNewKeyEnglish] = useState('');
  const [newKeyPersian, setNewKeyPersian] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Initialize editedTranslations with the current translations
  useEffect(() => {
    setEditedTranslations(translations);
  }, [translations]);

  // Filter translations based on search term and active tab
  const filteredTranslations = Object.entries(editedTranslations)
    .filter(([key, value]) => {
      const matchesSearch = searchTerm === '' || 
        key.toLowerCase().includes(searchTerm.toLowerCase()) || 
        value.en.toLowerCase().includes(searchTerm.toLowerCase()) || 
        value.fa.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === 'all') return matchesSearch;
      if (activeTab === 'navigation') return matchesSearch && (
        key.includes('home') || key.includes('about') || key.includes('contact') || 
        key.includes('login') || key.includes('profile') || key.includes('search')
      );
      if (activeTab === 'content') return matchesSearch && (
        key.includes('hero') || key.includes('title') || key.includes('description')
      );
      if (activeTab === 'footer') return matchesSearch && (
        key.includes('footer') || key.includes('rights') || key.includes('policy')
      );
      return matchesSearch;
    })
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  // Handle saving all changes
  const handleSaveAll = () => {
    Object.entries(editedTranslations).forEach(([key, value]) => {
      updateTranslation(key, value);
    });
    toast({
      title: "Translations saved",
      description: "All translation changes have been saved successfully.",
    });
  };

  // Handle updating a single translation
  const handleTranslationChange = (key: string, lang: 'en' | 'fa', value: string) => {
    setEditedTranslations(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value
      }
    }));
  };

  // Handle adding a new translation key
  const handleAddNewKey = () => {
    if (!newKeyName.trim() || !newKeyEnglish.trim() || !newKeyPersian.trim()) {
      toast({
        title: "Validation Error",
        description: "All fields are required to add a new translation key.",
        variant: "destructive"
      });
      return;
    }

    if (editedTranslations[newKeyName]) {
      toast({
        title: "Key already exists",
        description: "This translation key already exists. Please use a different key.",
        variant: "destructive"
      });
      return;
    }

    // Add the new key
    setEditedTranslations(prev => ({
      ...prev,
      [newKeyName]: {
        en: newKeyEnglish,
        fa: newKeyPersian
      }
    }));

    // Save the new key
    updateTranslation(newKeyName, {
      en: newKeyEnglish,
      fa: newKeyPersian
    });

    // Reset the form
    setNewKeyName('');
    setNewKeyEnglish('');
    setNewKeyPersian('');

    toast({
      title: "New translation added",
      description: `The translation key "${newKeyName}" has been added successfully.`,
    });
  };

  // Handle removing a translation key
  const handleRemoveKey = (key: string) => {
    const newTranslations = { ...editedTranslations };
    delete newTranslations[key];
    setEditedTranslations(newTranslations);
    
    toast({
      title: "Translation removed",
      description: `The translation key "${key}" has been removed.`,
    });
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Translation Management</h1>
            <p className="text-muted-foreground">Manage site translations for multiple languages</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Button 
              onClick={handleSaveAll} 
              size="sm"
              className="bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-navy"
            >
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Input 
            placeholder="Search translations..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full md:w-1/3 bg-secondary border-none"
          />
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Translations</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card className="mb-8 bg-secondary border-none">
              <CardHeader>
                <CardTitle>Add New Translation</CardTitle>
                <CardDescription>Add a new key for both English and Persian languages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="newKeyName">Key Name</Label>
                    <Input 
                      id="newKeyName" 
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., product_title"
                      className="bg-black/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newKeyEnglish">English Text</Label>
                    <Input 
                      id="newKeyEnglish" 
                      value={newKeyEnglish}
                      onChange={(e) => setNewKeyEnglish(e.target.value)}
                      placeholder="English translation"
                      className="bg-black/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newKeyPersian">Persian Text</Label>
                    <Input 
                      id="newKeyPersian" 
                      value={newKeyPersian}
                      onChange={(e) => setNewKeyPersian(e.target.value)}
                      placeholder="Persian translation"
                      dir="rtl"
                      className="bg-black/50 font-mirza"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddNewKey}>
                  <Plus className="h-4 w-4 mr-2" /> Add Translation
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {filteredTranslations.map(([key, { en, fa }]) => (
                <Card key={key} className="bg-secondary border-none">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">{key}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        onClick={() => handleRemoveKey(key)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor={`en-${key}`}>English</Label>
                        <Input 
                          id={`en-${key}`}
                          value={editedTranslations[key]?.en || ''}
                          onChange={(e) => handleTranslationChange(key, 'en', e.target.value)}
                          className="bg-black/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`fa-${key}`}>Persian</Label>
                        <Input 
                          id={`fa-${key}`}
                          value={editedTranslations[key]?.fa || ''}
                          onChange={(e) => handleTranslationChange(key, 'fa', e.target.value)}
                          dir="rtl"
                          className="bg-black/50 font-mirza"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
