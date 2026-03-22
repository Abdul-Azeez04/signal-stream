-- Allow insert, update, delete for signals (admin operations)
-- In production, you'd restrict these to authenticated admin users
CREATE POLICY "Allow insert signals" ON public.signals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update signals" ON public.signals FOR UPDATE USING (true);
CREATE POLICY "Allow delete signals" ON public.signals FOR DELETE USING (true);

-- Enable realtime for signals table
ALTER PUBLICATION supabase_realtime ADD TABLE public.signals;