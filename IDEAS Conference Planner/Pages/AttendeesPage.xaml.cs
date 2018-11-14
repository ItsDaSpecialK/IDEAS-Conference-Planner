﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace IDEAS_Conference_Planner.Pages
{
    /// <summary>
    /// Interaction logic for AttendeesPage.xaml
    /// </summary>
    public partial class AttendeesPage : Page
    {
        public AttendeesPage()
        {
            InitializeComponent();
        }
        private void Burger_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Uri("/Pages/HomePage.xaml", UriKind.Relative));
        }

        private void HomeView_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Uri("/Pages/HomePage.xaml", UriKind.Relative));
        }

        private void PresentationsView_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Uri("/Pages/PresentationsPage.xaml", UriKind.Relative));
        }

        private void AttendeesView_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Uri("/Pages/AttendeesPage.xaml", UriKind.Relative));
        }

        private void MailView_Click(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process.Start("mailto:");
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {

        }

       
    }
}
